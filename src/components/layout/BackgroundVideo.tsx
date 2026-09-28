import React, { useEffect, useRef, useState } from 'react';

interface BackgroundVideoProps {
  className?: string;
}

export const BackgroundVideo: React.FC<BackgroundVideoProps> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src = "https://designerstephen.github.io/public-assets/videos/observe-hero.mp4";
    video.playbackRate = 0.5;

    const handleLoadedData = () => {
      setVideoLoaded(true);
      video.play().catch(() => {
        // Autoplay may be blocked if unmuted, but it's muted
      });
    };

    const handleError = () => {
      console.warn("Observe hero video could not load, using dark ambient atmosphere");
      setHasError(true);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('error', handleError);
    };
  }, []);

  return (
    <div className={`fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0 select-none ${className}`}>
      {/* High-fidelity background video */}
      <video
        ref={videoRef}
        id="hero-video"
        className={`absolute inset-0 w-full h-full object-cover object-bottom transition-opacity duration-700 ${
          videoLoaded && !hasError ? 'opacity-90' : 'opacity-0'
        }`}
        muted
        autoPlay
        loop
        playsInline
        preload="auto"
      />

      {/* Fallback ambient mesh for when video is loading or offline */}
      {(!videoLoaded || hasError) && (
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black opacity-95">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,rgba(255,255,255,0.06)_0%,transparent_60%)]" />
        </div>
      )}
    </div>
  );
};
