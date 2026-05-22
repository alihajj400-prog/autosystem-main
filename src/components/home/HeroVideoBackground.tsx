import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO = '/hero.mp4';

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setVideoReady(true);

    video.addEventListener('loadeddata', onReady);
    video.play().catch(() => {});

    return () => {
      video.removeEventListener('loadeddata', onReady);
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-neutral-950">
      <video
        ref={videoRef}
        className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
          videoReady ? 'opacity-100' : 'opacity-0'
        }`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={HERO_VIDEO} type="video/mp4" />
      </video>

      <div className="hero-cinematic-overlay absolute inset-0" />
    </div>
  );
}
