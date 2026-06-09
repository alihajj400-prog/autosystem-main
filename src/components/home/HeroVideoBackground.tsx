import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO = '/hero.mp4';

export function HeroVideoBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '0px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const onReady = () => setVideoReady(true);
    video.addEventListener('loadeddata', onReady);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadeddata', onReady);
    };
  }, [shouldLoad]);

  return (
    <div ref={containerRef} className="absolute inset-0 overflow-hidden bg-neutral-950">
      {shouldLoad && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            videoReady ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      <div className="hero-cinematic-overlay absolute inset-0" />
    </div>
  );
}
