import React, { useState, useRef, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface VolumeControlProps {
  videoRef?: React.RefObject<HTMLVideoElement>;
  audioRef?: React.RefObject<HTMLAudioElement>;
  isVisible?: boolean;
}

export function VolumeControl({ videoRef, audioRef, isVisible = true }: VolumeControlProps) {
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Set initial volume for video and audio
    if (videoRef?.current) {
      videoRef.current.volume = volume / 100;
      videoRef.current.muted = isMuted;
    }
    if (audioRef?.current) {
      audioRef.current.volume = volume / 100;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted, videoRef, audioRef]);

  const handleVolumeChange = (newVolume: number[]) => {
    const volumeValue = newVolume[0];
    setVolume(volumeValue);
    setIsMuted(volumeValue === 0);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  if (!isVisible) return null;

  return (
    <div 
      className="fixed top-4 left-4 z-50 flex items-center"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Volume Icon */}
      <button
        onClick={handleMuteToggle}
        className="w-10 h-10 flex items-center justify-center bg-black/30 backdrop-blur-md rounded-lg border border-white/10 hover:bg-black/50 transition-all duration-300"
      >
        {isMuted || volume === 0 ? (
          <VolumeX className="w-5 h-5 text-white" />
        ) : (
          <Volume2 className="w-5 h-5 text-white" />
        )}
      </button>

      {/* Volume Slider - Expands on hover */}
      <div 
        className={`ml-2 flex items-center transition-all duration-300 ease-out ${
          isExpanded 
            ? 'opacity-100 translate-x-0 w-24' 
            : 'opacity-0 -translate-x-4 w-0 overflow-hidden'
        }`}
      >
        <div className="bg-black/30 backdrop-blur-md rounded-lg border border-white/10 px-3 py-2 min-w-24">
          <Slider
            value={[isMuted ? 0 : volume]}
            onValueChange={handleVolumeChange}
            max={100}
            min={0}
            step={1}
            className="w-20"
          />
        </div>
      </div>

      {/* Volume Percentage Display */}
      {isExpanded && (
        <div className="ml-2 text-xs text-white/80 bg-black/30 backdrop-blur-md rounded px-2 py-1 border border-white/10 min-w-10 text-center">
          {isMuted ? '0' : Math.round(volume)}%
        </div>
      )}
    </div>
  );
}