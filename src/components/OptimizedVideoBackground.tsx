import { useEffect, useRef, useState, useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import VideoControls from './VideoControls';

interface OptimizedVideoBackgroundProps {
  profileUserId?: string;
}

export default function OptimizedVideoBackground({ profileUserId }: OptimizedVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(false);
  
  const { profile } = useProfile();

  // Fetch profile for specific user or use current user's profile
  useEffect(() => {
    const fetchProfileVideo = async () => {
      if (profileUserId) {
        console.log('Fetching video for user:', profileUserId);
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('background_video_url')
            .eq('user_id', profileUserId)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching profile video:', error);
            setVideoUrl(null);
          } else {
            console.log('Fetched video URL:', data?.background_video_url);
            setVideoUrl(data?.background_video_url || null);
          }
        } catch (err) {
          console.error('Error fetching profile video:', err);
          setVideoUrl(null);
        }
      } else if (profile) {
        console.log('Using current profile video:', profile.background_video_url);
        setVideoUrl(profile.background_video_url);
      }
    };

    fetchProfileVideo();
  }, [profileUserId, profile]);

  const resetVideo = useCallback(() => {
    setIsLoaded(false);
    setIsPlaying(false);
    setError(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      setIsPlaying(false);
    } else {
      video.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleVideoLoad = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;

    console.log('Video loaded, attempting to play with sound');
    
    // Configure video for optimal performance
    video.currentTime = 0;
    video.playbackRate = 1;
    video.volume = volume;
    video.muted = false; // Enable sound by default
    
    setIsLoaded(true);
    setIsMuted(false);
    
    video.playsInline = true;
    video.loop = true;
    
    const playPromise = video.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Video playing successfully with sound');
          setIsPlaying(true);
          setError(false);
        })
        .catch((playError) => {
          console.log('Auto-play prevented or failed:', playError);
          // If auto-play with sound fails, try muted first
          video.muted = true;
          setIsMuted(true);
          video.play().then(() => {
            setIsPlaying(true);
          }).catch(console.error);
          
          // User can unmute manually
          document.addEventListener('click', () => {
            if (video.muted) {
              video.muted = false;
              setIsMuted(false);
            }
          }, { once: true });
        });
    }
  }, [volume]);

  const handleVideoError = useCallback((e: any) => {
    console.error('Video error:', e);
    setError(true);
    setIsLoaded(false);
    setIsPlaying(false);
  }, []);

  const handleVideoEnded = useCallback(() => {
    // Ensure seamless loop
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      video.play().catch(console.error);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (videoUrl) {
      console.log('Loading video:', videoUrl);
      resetVideo();
      
      // Set video properties before loading
      video.muted = true;
      video.playsInline = true;
      video.loop = true;
      video.autoplay = true;
      video.preload = 'auto';
      
      // Set video source and properties
      video.src = videoUrl;
      video.load();
      
      // Try to play immediately after load
      video.addEventListener('canplay', () => {
        video.play().catch(console.error);
      }, { once: true });
    } else {
      resetVideo();
      video.src = '';
    }
  }, [videoUrl, resetVideo]);

  // Intersection Observer for performance
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && isLoaded && !isPlaying) {
          video.play().catch(console.error);
        } else if (!entry.isIntersecting && isPlaying) {
          video.pause();
          setIsPlaying(false);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(video);
    
    return () => observer.disconnect();
  }, [isLoaded, isPlaying]);

  if (!videoUrl || error) {
    return (
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-smoke-950 via-background to-smoke-900" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,_hsl(var(--smoke-800))_0%,_transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,_hsl(var(--smoke-700))_0%,_transparent_50%)]" />
      </div>
    );
  }

  return (
    <>
      {/* Video Background */}
      <video
        ref={videoRef}
        className="fixed inset-0 w-full h-full object-cover z-0"
        loop
        muted={isMuted}
        playsInline
        preload="auto"
        crossOrigin="anonymous"
        autoPlay
        onLoadedData={handleVideoLoad}
        onError={handleVideoError}
        onEnded={handleVideoEnded}
        onLoadStart={() => console.log('Background video load started:', videoUrl)}
        onCanPlay={() => console.log('Background video can play')}
        onLoadedMetadata={() => console.log('Background video metadata loaded')}
        style={{
          filter: 'brightness(0.4) contrast(1.1) saturate(0.8)',
        }}
      />

      {/* Video Controls */}
      {isLoaded && (
        <VideoControls
          isPlaying={isPlaying}
          isMuted={isMuted}
          volume={volume}
          onTogglePlay={togglePlayPause}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
        />
      )}
      
      {/* Dark overlay for better readability */}
      <div className="fixed inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70 z-10" />
      
      {/* Subtle noise texture overlay for digital hideout feel */}
      <div 
        className="fixed inset-0 z-10 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </>
  );
}