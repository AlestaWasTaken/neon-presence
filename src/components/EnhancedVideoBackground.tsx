import { useEffect, useRef, useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, Upload, X, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedVideoBackgroundProps {
  profileUserId: string;
  userAuthId?: string;
}

export function EnhancedVideoBackground({ profileUserId, userAuthId }: EnhancedVideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  const { profile, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const canEdit = userAuthId === profileUserId;
  const currentVideoUrl = profile?.background_video_url || '';

  useEffect(() => {
    if (currentVideoUrl && videoRef.current) {
      setVideoUrl(currentVideoUrl);
      loadVideo(currentVideoUrl);
    }
  }, [currentVideoUrl]);

  const loadVideo = async (url: string) => {
    if (!videoRef.current || !url) return;

    setIsLoading(true);
    setError(null);
    setVideoLoaded(false);

    const video = videoRef.current;
    
    // Reset video element
    video.pause();
    video.currentTime = 0;
    
    try {
      video.src = url;
      
      await new Promise((resolve, reject) => {
        const handleLoad = () => {
          video.removeEventListener('loadeddata', handleLoad);
          video.removeEventListener('error', handleError);
          setVideoLoaded(true);
          setIsLoading(false);
          resolve(null);
        };

        const handleError = (e: Event) => {
          video.removeEventListener('loadeddata', handleLoad);
          video.removeEventListener('error', handleError);
          console.error('Video load error:', e);
          setError('Failed to load video. Please check the URL.');
          setIsLoading(false);
          reject(e);
        };

        video.addEventListener('loadeddata', handleLoad);
        video.addEventListener('error', handleError);
        video.load();
      });

      // Auto-play if successfully loaded
      try {
        await video.play();
        setIsPlaying(true);
      } catch (playError) {
        console.log('Auto-play prevented:', playError);
        setIsPlaying(false);
      }

    } catch (loadError) {
      console.error('Video loading failed:', loadError);
      setError('Failed to load video');
    }
  };

  const handleVideoUpdate = async (url: string) => {
    if (!canEdit) return;

    try {
      await updateProfile({ background_video_url: url });
      
      if (url) {
        loadVideo(url);
        toast({
          title: "Video Updated",
          description: "Background video has been updated successfully."
        });
      } else {
        setVideoLoaded(false);
        setVideoUrl('');
        toast({
          title: "Video Removed",
          description: "Background video has been removed."
        });
      }
    } catch (error) {
      console.error('Failed to update video:', error);
      toast({
        variant: "destructive",
        title: "Update Failed",
        description: "Failed to update video background."
      });
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current || !videoLoaded) return;

    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(console.error);
    }
  };

  const testUrls = [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://sample-videos.com/zip/10/mp4/SampleVideo_720x480_1mb.mp4',
    'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
  ];

  return (
    <>
      {/* Video Background */}
      {videoLoaded && (
        <video
          ref={videoRef}
          className="fixed inset-0 w-full h-full object-cover z-0"
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => console.log('Video loaded successfully')}
          onError={(e) => console.error('Video error:', e)}
        />
      )}
      
      {/* Dark overlay for better text readability */}
      {videoLoaded && (
        <div className="fixed inset-0 bg-black/40 z-0" />
      )}

      {/* Video Controls (only for editing mode) */}
      {canEdit && (
        <Card className="bg-card/90 backdrop-blur-sm border-border/50">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Video Background</h3>
              {videoLoaded && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={togglePlayPause}
                  className="gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="Enter video URL (MP4, WebM)"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleVideoUpdate(videoUrl)}
                  disabled={isLoading}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isLoading ? 'Loading...' : 'Update'}
                </Button>
              </div>

              {currentVideoUrl && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleVideoUpdate('')}
                  className="gap-2 text-destructive hover:text-destructive"
                >
                  <X className="w-4 h-4" />
                  Remove Video
                </Button>
              )}
            </div>

            {/* Test URLs */}
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Quick test videos:</p>
              <div className="flex flex-wrap gap-2">
                {testUrls.map((url, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setVideoUrl(url);
                      handleVideoUpdate(url);
                    }}
                    className="text-xs"
                  >
                    Test Video {index + 1}
                  </Button>
                ))}
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" />
                {error}
              </div>
            )}

            {/* Video Info */}
            {videoLoaded && videoRef.current && (
              <div className="text-sm text-muted-foreground space-y-1">
                <p>Resolution: {videoRef.current.videoWidth}x{videoRef.current.videoHeight}</p>
                <p>Duration: {Math.round(videoRef.current.duration || 0)}s</p>
              </div>
            )}

            {/* Performance Tips */}
            <div className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <p className="font-medium mb-1">Performance Tips:</p>
              <ul className="space-y-1 text-xs">
                <li>• Use MP4 format for best compatibility</li>
                <li>• Keep file size under 10MB for faster loading</li>
                <li>• 720p resolution is optimal for web</li>
                <li>• Videos auto-loop and are muted by default</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
}