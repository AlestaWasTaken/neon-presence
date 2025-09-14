import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';

interface BackgroundAudioProps {
  profileUserId?: string;
  audioRef?: React.RefObject<HTMLAudioElement>;
}

export default function BackgroundAudio({ profileUserId, audioRef }: BackgroundAudioProps) {
  const internalAudioRef = useRef<HTMLAudioElement>(null);
  const currentAudioRef = audioRef || internalAudioRef;
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  
  const { profile } = useProfile();

  // Fetch audio URL
  useEffect(() => {
    const fetchAudio = async () => {
      let url = null;
      
      if (profileUserId) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('audio_url')
            .eq('user_id', profileUserId)
            .single();
          url = data?.audio_url;
        } catch (err) {
          console.error('Error fetching audio:', err);
        }
      } else if (profile) {
        url = profile.audio_url;
      }
      
      setAudioUrl(url);
    };

    fetchAudio();
  }, [profileUserId, profile]);

  // Setup audio
  useEffect(() => {
    if (!audioUrl) return;

    const audio = currentAudioRef.current;
    if (!audio) return;

    const handleLoad = () => {
      audio.volume = 0.3;
      audio.muted = true;
      audio.loop = true;
      
      // Play on user interaction
      const playOnInteraction = () => {
        audio.play().catch(console.error);
        
        document.removeEventListener('click', playOnInteraction);
        document.removeEventListener('touchstart', playOnInteraction);
      };
      
      document.addEventListener('click', playOnInteraction);
      document.addEventListener('touchstart', playOnInteraction);
    };

    audio.addEventListener('canplay', handleLoad);
    audio.src = audioUrl;
    audio.load();

    return () => {
      audio.removeEventListener('canplay', handleLoad);
    };
  }, [audioUrl]);


  if (!audioUrl) return null;

  return <audio ref={currentAudioRef} />;
}