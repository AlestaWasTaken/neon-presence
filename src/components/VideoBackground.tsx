import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface VideoBackgroundProps {
  profileUserId?: string;
}

export default function VideoBackground({ profileUserId }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isVideo, setIsVideo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  const { profile } = useProfile();

  // Fetch media URL
  useEffect(() => {
    const fetchMedia = async () => {
      let url = null;
      
      if (profileUserId) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('background_video_url')
            .eq('user_id', profileUserId)
            .single();
          url = data?.background_video_url;
        } catch (err) {
          console.error('Error fetching media:', err);
        }
      } else if (profile) {
        url = profile.background_video_url;
      }
      
      if (url) {
        setMediaUrl(url);
        // Check if it's a video or image
        const videoExtensions = /\.(mp4|webm|ogg|mov)$/i;
        setIsVideo(videoExtensions.test(url));
      } else {
        setMediaUrl(null);
      }
    };

    fetchMedia();
  }, [profileUserId, profile]);

  // Handle video loading
  useEffect(() => {
    if (!isVideo || !mediaUrl) return;

    const video = videoRef.current;
    if (!video) return;

    const handleLoad = () => {
      setIsLoaded(true);
      setError(false);
      
      // Start playing
      video.play().catch((err) => {
        console.log('Autoplay failed, will play on user interaction:', err);
        
        // Try to play on first user interaction
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
      setIsLoaded(false);
    };

    video.addEventListener('canplay', handleLoad);
    video.addEventListener('error', handleError);
    
    // Set video properties
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = 'metadata';
    
    // Load video
    video.src = mediaUrl;
    video.load();

    return () => {
      video.removeEventListener('canplay', handleLoad);
      video.removeEventListener('error', handleError);
    };
  }, [isVideo, mediaUrl]);

  // Default gradient background
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
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      
      {/* Subtle noise texture */}
      <div 
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}