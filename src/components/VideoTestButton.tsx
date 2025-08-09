import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useProfile } from '@/hooks/useProfile';
import { Play, Pause } from 'lucide-react';

const VideoTestButton = () => {
  const { profile, updateProfile } = useProfile();
  const [isTestingVideo, setIsTestingVideo] = useState(false);

  const testVideos = [
    {
      name: 'Çalışan Video Test',
      url: 'https://www.w3schools.com/html/mov_bbb.mp4'
    },
    {
      name: 'Başka Test Video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_640x360_1mb.mp4'
    }
  ];

  const handleTestVideo = async (videoUrl: string) => {
    setIsTestingVideo(true);
    console.log('Testing video URL:', videoUrl);
    
    try {
      await updateProfile({ background_video_url: videoUrl });
      console.log('Video URL updated successfully');
    } catch (error) {
      console.error('Failed to update video URL:', error);
    } finally {
      setIsTestingVideo(false);
    }
  };

  const handleRemoveVideo = async () => {
    setIsTestingVideo(true);
    try {
      await updateProfile({ background_video_url: null });
      console.log('Video removed successfully');
    } catch (error) {
      console.error('Failed to remove video:', error);
    } finally {
      setIsTestingVideo(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2">
      <div className="bg-card/90 backdrop-blur border rounded-lg p-3 space-y-2">
        <p className="text-xs text-muted-foreground">Video Test</p>
        
        {testVideos.map((video, index) => (
          <Button
            key={index}
            size="sm"
            variant="outline"
            onClick={() => handleTestVideo(video.url)}
            disabled={isTestingVideo}
            className="w-full justify-start"
          >
            <Play className="h-3 w-3 mr-2" />
            {video.name}
          </Button>
        ))}
        
        <Button
          size="sm"
          variant="destructive"
          onClick={handleRemoveVideo}
          disabled={isTestingVideo}
          className="w-full justify-start"
        >
          <Pause className="h-3 w-3 mr-2" />
          Video Kaldır
        </Button>
        
        {profile.background_video_url && (
          <p className="text-xs text-muted-foreground break-all">
            Aktif: {profile.background_video_url.slice(0, 30)}...
          </p>
        )}
      </div>
    </div>
  );
};

export default VideoTestButton;