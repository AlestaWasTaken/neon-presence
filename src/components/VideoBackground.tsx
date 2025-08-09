import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface VideoBackgroundProps {
  profileUserId?: string;
}

const VideoBackground = ({ profileUserId }: VideoBackgroundProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [profileVideoUrl, setProfileVideoUrl] = useState<string | null>(null);
  
  useEffect(() => {
    if (profileUserId && profileUserId !== user?.id) {
      // Fetch other user's profile data
      fetchOtherUserProfile();
    } else if (user?.id === profileUserId && profile) {
      // Use current user's profile
      setProfileVideoUrl(profile.background_video_url);
    }
  }, [profileUserId, user, profile]);

  const fetchOtherUserProfile = async () => {
    if (!profileUserId) return;

    const { data } = await supabase
      .from('profiles')
      .select('background_video_url')
      .eq('user_id', profileUserId)
      .single();

    if (data) {
      setProfileVideoUrl(data.background_video_url);
    }
  };

  if (!profileVideoUrl) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    );
  }

  return (
    <>
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        style={{ zIndex: -1 }}
      >
        <source src={profileVideoUrl} type="video/mp4" />
      </video>
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/20 pointer-events-none" />
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 pointer-events-none" />
    </>
  );
};

export default VideoBackground;