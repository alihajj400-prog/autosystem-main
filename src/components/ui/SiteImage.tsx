import { useEffect, useState } from 'react';
import { getSizedImageUrl } from '@/lib/images';
import { cn } from '@/lib/utils';

interface SiteImageProps {
  src: string;
  alt: string;
  className?: string;
  optimizedWidth?: number;
  quality?: number;
  priority?: boolean;
  width?: number;
  height?: number;
}

export function SiteImage({
  src,
  alt,
  className,
  optimizedWidth,
  quality = 75,
  priority = false,
  width,
  height,
}: SiteImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(() =>
    optimizedWidth ? getSizedImageUrl(src, { width: optimizedWidth, quality }) : src
  );

  useEffect(() => {
    setLoaded(false);
    setCurrentSrc(
      optimizedWidth ? getSizedImageUrl(src, { width: optimizedWidth, quality }) : src
    );
  }, [src, optimizedWidth, quality]);

  const handleError = () => {
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setLoaded(false);
    }
  };

  return (
    <>
      {!loaded && <div className="absolute inset-0 z-0 animate-pulse bg-muted" aria-hidden />}
      <img
        src={currentSrc}
        alt={alt}
        width={width}
        height={height}
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
