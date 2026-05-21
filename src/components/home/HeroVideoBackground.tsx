import { useEffect, useRef, useState } from 'react';

const HERO_VIDEO = '/hero.mp4';
const HERO_POSTER = '/hero-poster.jpg';

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onReady = () => setVideoReady(true);
    const onError = () => setVideoFailed(true);

    video.addEventListener('loadeddata', onReady);
    video.addEventListener('error', onError);

    video.play().catch(() => setVideoFailed(true));

    return () => {
      video.removeEventListener('loadeddata', onReady);
      video.removeEventListener('error', onError);
    };
  }, []);

  const showVideo = videoReady && !videoFailed;

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          showVideo ? 'opacity-0' : 'opacity-100 ken-burns'
        }`}
        style={{ backgroundImage: `url(${HERO_POSTER})` }}
        aria-hidden
      />

      {!videoFailed && (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000 ${
            showVideo ? 'opacity-100' : 'opacity-0'
          }`}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={HERO_POSTER}
        >
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
      )}

      <div className="hero-cinematic-overlay absolute inset-0" />
    </div>
  );
}
