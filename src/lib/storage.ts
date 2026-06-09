import { supabase } from '@/integrations/supabase/client';

const BUCKETS = ['car-images', 'part-images'] as const;
type StorageBucket = (typeof BUCKETS)[number];

export type StorageRef = { bucket: StorageBucket; path: string };

/** Extract bucket + path from a Supabase public or render image URL. */
export function getStorageRefFromUrl(url: string): StorageRef | null {
  if (!url) return null;

  const match = url.match(
    /\/storage\/v1\/(?:object|render\/image)\/public\/(car-images|part-images)\/(.+?)(?:\?|$)/
  );
  if (!match) return null;

  return {
    bucket: match[1] as StorageBucket,
    path: decodeURIComponent(match[2]),
  };
}

/** Delete image files from Supabase Storage (ignores non-storage URLs). */
export async function deleteStorageImages(urls: string[]): Promise<void> {
  const byBucket = new Map<StorageBucket, string[]>();

  for (const url of urls) {
    const ref = getStorageRefFromUrl(url);
    if (!ref) continue;
    const paths = byBucket.get(ref.bucket) ?? [];
    if (!paths.includes(ref.path)) paths.push(ref.path);
    byBucket.set(ref.bucket, paths);
  }

  for (const [bucket, paths] of byBucket.entries()) {
    if (paths.length === 0) continue;
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) console.error(`Storage cleanup failed (${bucket}):`, error.message);
  }
}

async function listFilesInFolder(bucket: StorageBucket, folder: string): Promise<string[]> {
  const { data, error } = await supabase.storage.from(bucket).list(folder, {
    limit: 1000,
    sortBy: { column: 'name', order: 'asc' },
  });
  if (error) throw error;

  return (data ?? [])
    .filter((item) => item.name && !item.name.endsWith('/'))
    .map((item) => `${folder}/${item.name}`);
}

async function collectReferencedPaths(): Promise<Set<string>> {
  const referenced = new Set<string>();

  const [{ data: cars }, { data: parts }] = await Promise.all([
    supabase.from('cars').select('images'),
    supabase.from('parts').select('images'),
  ]);

  for (const row of [...(cars ?? []), ...(parts ?? [])]) {
    for (const url of (row.images as string[]) ?? []) {
      const ref = getStorageRefFromUrl(url);
      if (ref) referenced.add(`${ref.bucket}:${ref.path}`);
    }
  }

  return referenced;
}

/**
 * Remove storage files that are not linked to any car or part listing.
 * Use once to reclaim space from old uploads, then rely on automatic cleanup.
 */
export async function cleanupOrphanedImages(): Promise<number> {
  const referenced = await collectReferencedPaths();
  const orphans: StorageRef[] = [];

  for (const bucket of BUCKETS) {
    const folder = bucket === 'car-images' ? 'cars' : 'parts';
    const files = await listFilesInFolder(bucket, folder);
    for (const path of files) {
      if (!referenced.has(`${bucket}:${path}`)) {
        orphans.push({ bucket, path });
      }
    }
  }

  const byBucket = new Map<StorageBucket, string[]>();
  for (const { bucket, path } of orphans) {
    const paths = byBucket.get(bucket) ?? [];
    paths.push(path);
    byBucket.set(bucket, paths);
  }

  let deleted = 0;
  for (const [bucket, paths] of byBucket.entries()) {
    const { error } = await supabase.storage.from(bucket).remove(paths);
    if (error) throw error;
    deleted += paths.length;
  }

  return deleted;
}
