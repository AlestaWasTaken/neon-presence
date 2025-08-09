import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause } from 'lucide-react';

interface VideoControlsProps {
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onVolumeChange: (volume: number) => void;
}

export default function VideoControls({
  isPlaying,
  isMuted,
  volume,
  onTogglePlay,
  onToggleMute,
  onVolumeChange,
}: VideoControlsProps) {
  const [showControls, setShowControls] = useState(false);

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 transition-all duration-300 ease-in-out"
      style={{ 
        opacity: showControls ? 1 : 0.7,
        transform: showControls ? 'scale(1)' : 'scale(0.95)'
      }}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div className="bg-black/70 backdrop-blur-md rounded-xl p-3 border border-white/20 shadow-2xl">
        <div className="flex items-center gap-3">
          {/* Play/Pause Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onTogglePlay}
            className="bg-white/10 hover:bg-white/20 text-white border-none rounded-lg p-2 h-8 w-8"
          >
            {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>

          {/* Mute/Unmute Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleMute}
            className="bg-white/10 hover:bg-white/20 text-white border-none rounded-lg p-2 h-8 w-8"
          >
            {isMuted ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
          </Button>

          {/* Volume Slider */}
          <div className="flex items-center gap-2">
            <div className="relative w-16 h-1 bg-white/20 rounded-full cursor-pointer">
              <div 
                className="absolute top-0 left-0 h-full bg-gradient-to-r from-white to-white/80 rounded-full transition-all duration-150"
                style={{ width: `${volume * 100}%` }}
              />
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={volume}
                onChange={(e) => onVolumeChange(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div 
                className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-md transition-all duration-150"
                style={{ left: `calc(${volume * 100}% - 4px)` }}
              />
            </div>
            <span className="text-white text-xs font-medium min-w-[1.5rem] text-center">
              {Math.round(volume * 100)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}