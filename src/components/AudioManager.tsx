import { useEffect, useRef, useState, useCallback } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Music } from 'lucide-react';

interface AudioManagerProps {
  profileUserId?: string;
}

export default function AudioManager({ profileUserId }: AudioManagerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [isMuted, setIsMuted] = useState(true);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [showControls, setShowControls] = useState(false);
  
  const { profile } = useProfile();

  // Fetch audio URL
  useEffect(() => {
    const fetchAudio = async () => {
      if (profileUserId) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('audio_url')
            .eq('user_id', profileUserId)
            .single();
          
          if (error && error.code !== 'PGRST116') {
            console.error('Error fetching audio:', error);
            setAudioUrl(null);
          } else {
            setAudioUrl(data?.audio_url || null);
          }
        } catch (err) {
          console.error('Error fetching audio:', err);
          setAudioUrl(null);
        }
      } else if (profile) {
        setAudioUrl(profile.audio_url);
      }
    };

    fetchAudio();
  }, [profileUserId, profile]);

  const togglePlayPause = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(console.error);
      setIsPlaying(true);
    }
  }, [isPlaying]);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  }, []);

  const handleVolumeChange = useCallback((newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  }, []);

  const handleAudioLoad = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = volume;
    audio.muted = true; // Start muted
    audio.loop = true;
    
    // Auto-play on first user interaction
    const enableAudio = () => {
      if (audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true);
          setIsMuted(false);
          audio.muted = false;
        }).catch(console.error);
      }
    };

    document.addEventListener('click', enableAudio, { once: true });
    document.addEventListener('touchstart', enableAudio, { once: true });
  }, [volume]);

  if (!audioUrl) {
    return null;
  }

  return (
    <>
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedData={handleAudioLoad}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onError={() => console.error('Audio error')}
      />

      {/* Audio Controls */}
      <div 
        className="fixed bottom-24 right-8 z-20 transition-all duration-300"
        style={{ 
          opacity: showControls || isPlaying ? 1 : 0,
          transform: showControls || isPlaying ? 'translateY(0)' : 'translateY(10px)'
        }}
        onMouseEnter={() => setShowControls(true)}
        onMouseLeave={() => setTimeout(() => setShowControls(false), 2000)}
      >
        <div className="bg-black/80 backdrop-blur-sm rounded-2xl p-4 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-4 mb-3">
            {/* Play/Pause Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={togglePlayPause}
              className="bg-white/20 hover:bg-white/30 text-white border-none rounded-xl p-2"
            >
              <Music className="h-4 w-4" />
            </Button>

            {/* Mute/Unmute Button */}
            <Button
              variant="secondary"
              size="sm"
              onClick={toggleMute}
              className="bg-white/20 hover:bg-white/30 text-white border-none rounded-xl p-2"
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </Button>

            {/* Volume Slider */}
            <div className="flex items-center gap-2">
              <div className="relative w-20 h-1 bg-white/30 rounded-full cursor-pointer">
                <div 
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-primary/80 rounded-full transition-all duration-200"
                  style={{ width: `${volume * 100}%` }}
                />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => handleVolumeChange(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg transition-all duration-200"
                  style={{ left: `calc(${volume * 100}% - 6px)` }}
                />
              </div>
              <span className="text-white text-xs font-medium min-w-[2.5rem]">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
          
          {/* Audio Label */}
          <div className="text-center text-white/60 text-xs">
            Background Music
          </div>
        </div>
      </div>
    </>
  );
}