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
