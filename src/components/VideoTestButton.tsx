import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface VideoTestButtonProps {
  videoUrl: string | null;
}

export function VideoTestButton({ videoUrl }: VideoTestButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!videoUrl) return null;

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          Test Video
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] bg-background/95 backdrop-blur-sm border-white/10">
        <DialogHeader>
          <DialogTitle>Video Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
            <video
              ref={videoRef}
              src={videoUrl}
              className="w-full h-full object-cover"
              loop
              muted={isMuted}
              playsInline
              crossOrigin="anonymous"
              preload="auto"
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={handleVideoEnded}
              onLoadStart={() => console.log('Test video load started:', videoUrl)}
              onLoadedData={() => console.log('Test video loaded successfully')}
              onError={(e) => console.error('Test video error:', e, 'URL:', videoUrl)}
              onCanPlay={() => console.log('Test video can play')}
            />
            <div className="absolute bottom-4 left-4 flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={togglePlay}
                className="bg-black/50 hover:bg-black/70 text-white border-none"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleMute}
                className="bg-black/50 hover:bg-black/70 text-white border-none"
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            This is how your background video will appear on your profile.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}