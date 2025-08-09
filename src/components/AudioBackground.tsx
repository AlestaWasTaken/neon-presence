import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Volume2, VolumeX } from 'lucide-react';

interface AudioBackgroundProps {
  profileUserId?: string;
}

export default function AudioBackground({ profileUserId }: AudioBackgroundProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.3);
  
  const { profile } = useProfile();
  
  // Get audio URL from temporary storage in custom_cursor_url
  const audioUrl = profile?.custom_cursor_url?.includes('audio') ? profile.custom_cursor_url : null;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioUrl) return;

    audio.src = audioUrl;
    audio.volume = volume;
    audio.loop = true;
    
    // Try to play audio (will be muted initially due to autoplay policy)
    const playPromise = audio.play();
    if (playPromise) {
      playPromise.catch(console.error);
    }
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, [audioUrl, volume]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().then(() => {
        setIsPlaying(true);
        setIsMuted(false);
        audio.muted = false;
      }).catch(console.error);
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  if (!audioUrl) return null;

  return (
    <>
      <audio
        ref={audioRef}
        loop
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      />
      
      {/* Audio Controls - Fixed position */}
      <div className="fixed bottom-4 right-4 z-50 bg-black/20 backdrop-blur-sm border border-white/10 rounded-lg p-2 flex items-center gap-2">
        <button
          onClick={togglePlayPause}
          className="text-white/70 hover:text-white transition-colors p-1"
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        
        <button
          onClick={toggleMute}
          className="text-white/70 hover:text-white transition-colors p-1"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => {
            const newVolume = parseFloat(e.target.value);
            setVolume(newVolume);
            if (audioRef.current) {
              audioRef.current.volume = newVolume;
            }
          }}
          className="w-20 text-xs"
        />
      </div>
    </>
  );
}