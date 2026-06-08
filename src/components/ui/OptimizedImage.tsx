import { useState } from 'react';
import { cn } from '@/lib/utils';
import { getOptimizedImageUrl } from '@/lib/images';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  quality?: number;
  priority?: boolean;
}

export function OptimizedImage({
  src,
  alt,
  className,
  width = 640,
  quality = 75,
  priority = false,
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() =>
    getOptimizedImageUrl(src, { width, quality })
  );

  const handleError = () => {
    if (currentSrc !== src) {
      setCurrentSrc(src);
    }
  };

  return (
    <>
      {!loaded && <div className="absolute inset-0 z-0 animate-pulse bg-muted" aria-hidden />}
      <img
        src={currentSrc}
        alt={alt}
        className={cn(
          'relative z-[1] h-full w-full transition-opacity duration-300',
          loaded ? 'opacity-100' : 'opacity-0',
          className
        )}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={handleError}
      />
    </>
  );
}
