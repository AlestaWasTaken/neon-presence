import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Profile } from '@/types';

interface VideoBackgroundProps {
  profileUserId?: string;
}

export default function VideoBackground({ profileUserId }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchMedia = async () => {
      if (!profileUserId) return;

      try {
        const { data } = await supabase
          .from('profiles')
          .select('background_video_url')
          .eq('user_id', profileUserId)
          .single();

        const url = data?.background_video_url;
        if (url) {
          setMediaUrl(url);
          const videoExtensions = /\.(mp4|webm|ogg|mov)$/i;
          setIsVideo(videoExtensions.test(url));
        } else {
          setMediaUrl(null);
        }
      } catch (err) {
        console.error('Error fetching media:', err);
        setMediaUrl(null);
      }
    };

    fetchMedia();
  }, [profileUserId]);

  useEffect(() => {
    if (!isVideo || !mediaUrl) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setError(false);
      video.play().catch((err) => {
        console.log('Autoplay failed:', err);
        const playOnInteraction = () => {
          video.play().catch(console.error);
          document.removeEventListener('click', playOnInteraction);
          document.removeEventListener('touchstart', playOnInteraction);
        };
        document.addEventListener('click', playOnInteraction);
        document.addEventListener('touchstart', playOnInteraction);
      });
    };

    const handleError = () => {
      setError(true);
    };

    video.addEventListener('canplay', handleLoad);
    video.addEventListener('error', handleError);
    
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.preload = 'metadata';
    video.src = mediaUrl;
    video.load();

    return () => {
      video.removeEventListener('canplay', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [isVideo, mediaUrl]);

  if (!mediaUrl || error) {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-smoke-950 via-background to-smoke-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(var(--smoke-800))_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(var(--smoke-700))_0%,_transparent_50%)]" />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-0">
      {isVideo ? (
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          style={{ filter: 'brightness(0.4) contrast(1.1) saturate(0.8)' }}
        />
      ) : (
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ 
            backgroundImage: `url(${mediaUrl})`,
            filter: 'brightness(0.4) contrast(1.1) saturate(0.8)'
          }}
        />
      )}
      
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
    </div>
  );
}