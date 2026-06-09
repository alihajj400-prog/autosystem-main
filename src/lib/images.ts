import { supabase } from '@/integrations/supabase/client';
import {
  deleteStorageImages,
  getStorageRefFromUrl,
  type StorageRef,
} from '@/lib/storage';

interface SizedImageOptions {
  width?: number;
  quality?: number;
}

/**
 * Request a smaller WebP Supabase image (proportional scale, never cropped).
 * Falls back to the original URL if transforms are unavailable.
 */
export function getSizedImageUrl(
  url: string,
  { width = 800, quality = 70 }: SizedImageOptions = {}
): string {
  if (!url) return url;

  const match = url.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/);
  if (!match) return url;

  const [, base, path] = match;
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality),
    resize: 'contain',
    format: 'webp',
  });

  return `${base}/storage/v1/render/image/public/${path}?${params}`;
}

/** Compress large uploads before sending to storage (helps future listings load faster). */
export async function compressImageFile(
  file: File,
  maxWidth = 1400,
  quality = 0.8
): Promise<File> {
  if (!file.type.startsWith('image/')) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      bitmap.close();
      return file;
    }

    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    let blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/webp', quality)
    );
    let extension = 'webp';
    let mimeType = 'image/webp';

    if (!blob || blob.size === 0) {
      blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, 'image/jpeg', quality)
      );
      extension = 'jpg';
      mimeType = 'image/jpeg';
    }

    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, `.${extension}`);
    return new File([blob], name, { type: mimeType });
  } catch {
    return file;
  }
}

const SMALL_FILE_BYTES = 350_000;

async function uploadToBucket(file: File, bucket: StorageRef['bucket']): Promise<string> {
  const fileExt = file.name.split('.').pop() || 'webp';
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
  const folder = bucket === 'car-images' ? 'cars' : 'parts';
  const filePath = `${folder}/${fileName}`;

  const { error } = await supabase.storage.from(bucket).upload(filePath, file);
  if (error) throw error;

  return supabase.storage.from(bucket).getPublicUrl(filePath).data.publicUrl;
}

/** Permanently recompress large listing images already stored in Supabase. */
export async function compressAllListingImages(
  onProgress?: (message: string) => void
): Promise<{ optimized: number; skipped: number; failed: number }> {
  const [{ data: cars }, { data: parts }] = await Promise.all([
    supabase.from('cars').select('id, images'),
    supabase.from('parts').select('id, images'),
  ]);

  const allUrls = new Set<string>();
  for (const row of [...(cars ?? []), ...(parts ?? [])]) {
    for (const url of (row.images as string[]) ?? []) {
      if (getStorageRefFromUrl(url)) allUrls.add(url);
    }
  }

  const replacements = new Map<string, string>();
  let optimized = 0;
  let skipped = 0;
  let failed = 0;
  let index = 0;

  for (const url of allUrls) {
    index += 1;
    onProgress?.(`Compressing image ${index} of ${allUrls.size}...`);

    try {
      const ref = getStorageRefFromUrl(url);
      if (!ref) {
        skipped += 1;
        continue;
      }

      const response = await fetch(url);
      if (!response.ok) {
        failed += 1;
        continue;
      }

      const blob = await response.blob();
      if (blob.size <= SMALL_FILE_BYTES) {
        skipped += 1;
        continue;
      }

      const file = new File([blob], 'photo.jpg', { type: blob.type || 'image/jpeg' });
      const compressed = await compressImageFile(file, 1200, 0.75);

      if (compressed.size >= blob.size * 0.85) {
        skipped += 1;
        continue;
      }

      const newUrl = await uploadToBucket(compressed, ref.bucket);
      replacements.set(url, newUrl);
      optimized += 1;
    } catch {
      failed += 1;
    }
  }

  if (replacements.size > 0) {
    onProgress?.('Updating listings...');

    for (const car of cars ?? []) {
      const images = (car.images as string[]) ?? [];
      const updated = images.map((imageUrl) => replacements.get(imageUrl) ?? imageUrl);
      if (updated.some((imageUrl, i) => imageUrl !== images[i])) {
        await supabase.from('cars').update({ images: updated }).eq('id', car.id);
      }
    }

    for (const part of parts ?? []) {
      const images = (part.images as string[]) ?? [];
      const updated = images.map((imageUrl) => replacements.get(imageUrl) ?? imageUrl);
      if (updated.some((imageUrl, i) => imageUrl !== images[i])) {
        await supabase.from('parts').update({ images: updated }).eq('id', part.id);
      }
    }

    onProgress?.('Removing old files...');
    await deleteStorageImages([...replacements.keys()]);
  }

  return { optimized, skipped, failed };
}
