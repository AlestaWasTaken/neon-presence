import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface BackgroundAudioProps {
  profileUserId?: string;
}

export default function BackgroundAudio({ profileUserId }: BackgroundAudioProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  const [showControls, setShowControls] = useState(false);
  
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

    const audio = audioRef.current;
    if (!audio) return;

    const handleLoad = () => {
      audio.volume = volume;
      audio.muted = true;
      audio.loop = true;
      
      // Play on user interaction
      const playOnInteraction = () => {
        audio.play().then(() => {
          setIsPlaying(true);
        }).catch(console.error);
        
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
  }, [audioUrl, volume]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  if (!audioUrl) return null;

  return (
    <>
      <audio ref={audioRef} />
      
      {/* Audio Controls */}
      <div 
        className="fixed bottom-8 left-8 z-50 transition-all duration-300"
        style={{ 
          opacity: showControls ? 1 : 0.6,
          transform: showControls ? 'scale(1)' : 'scale(0.9)'
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setShowControls(false)}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-xl p-3 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-3">
            {/* Play/Pause */}
            <Button
              variant="ghost"
              size="sm"
              onClick={togglePlay}
              className="bg-white/10 hover:bg-white/20 text-white border-none rounded-lg p-2 h-8 w-8"
            >
              <Music className="h-3 w-3" />
            </Button>

            {/* Mute */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMute}
              className="bg-white/10 hover:bg-white/20 text-white border-none rounded-lg p-2 h-8 w-8"
            >
              {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
            </Button>

            {/* Volume */}
            {showControls && (
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="w-16 h-1 bg-white/30 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full"
                />
                <span className="text-white text-xs min-w-[2rem]">
                  {Math.round(volume * 100)}%
                </span>
              </div>
            )}
          </div>
          
          {/* Label */}
          <div className="text-center text-white/60 text-xs mt-1">
            Audio
          </div>
        </div>
      </div>
    </>
  );
}