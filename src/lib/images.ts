interface ImageTransformOptions {
  width?: number;
  height?: number;
  quality?: number;
}

/** Resize Supabase storage URLs to smaller, web-friendly versions. */
export function getOptimizedImageUrl(url: string, options: ImageTransformOptions = {}): string {
  if (!url) return url;

  const objectMatch = url.match(/^(https?:\/\/[^/]+)\/storage\/v1\/object\/public\/(.+)$/);
  if (!objectMatch) return url;

  const [, base, path] = objectMatch;
  const params = new URLSearchParams();
  if (options.width) params.set('width', String(options.width));
  if (options.height) params.set('height', String(options.height));
  if (options.quality) params.set('quality', String(options.quality));

  const query = params.toString();
  return `${base}/storage/v1/render/image/public/${path}${query ? `?${query}` : ''}`;
}

/** Compress large uploads before sending to storage (helps future listings load faster). */
export async function compressImageFile(
  file: File,
  maxWidth = 1600,
  quality = 0.82
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

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, 'image/jpeg', quality)
    );
    if (!blob) return file;

    const name = file.name.replace(/\.[^.]+$/, '.jpg');
    return new File([blob], name, { type: 'image/jpeg' });
  } catch {
    return file;
  }
}
