import { useEffect, useRef, useState } from 'react';
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
  quality = 70,
  priority = false,
  width,
  height,
}: SiteImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(priority);
  const [loaded, setLoaded] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    if (priority) {
      setInView(true);
      return;
    }

    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [priority]);

  useEffect(() => {
    if (!inView) return;
    setLoaded(false);
    setCurrentSrc(
      optimizedWidth ? getSizedImageUrl(src, { width: optimizedWidth, quality }) : src
    );
  }, [src, optimizedWidth, quality, inView]);

  const handleError = () => {
    if (currentSrc !== src) {
      setCurrentSrc(src);
      setLoaded(false);
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      {!loaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-muted" aria-hidden />
      )}
      {inView ? (
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
      ) : null}
    </div>
  );
}
