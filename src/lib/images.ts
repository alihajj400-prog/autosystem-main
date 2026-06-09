interface SizedImageOptions {
  width?: number;
  quality?: number;
}

/**
 * Request a smaller Supabase image (proportional scale, never cropped).
 * Falls back to the original URL if transforms are unavailable.
 */
export function getSizedImageUrl(
  url: string,
  { width = 800, quality = 75 }: SizedImageOptions = {}
): string {
  if (!url) return url;

  const match = url.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/);
  if (!match) return url;

  const [, base, path] = match;
  const params = new URLSearchParams({
    width: String(width),
    quality: String(quality),
    resize: 'contain',
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
