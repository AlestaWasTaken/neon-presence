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
    console.log('VideoBackground - Props changed:', { profileUserId, userAuthId: user?.id });
    
    if (profileUserId && profileUserId !== user?.id) {
      // Fetch other user's profile data
      console.log('Fetching OTHER user video data');
      fetchOtherUserProfile();
    } else if (user?.id === profileUserId && profile) {
      // Use current user's profile
      console.log('Using CURRENT user profile video:', profile.background_video_url);
      setProfileVideoUrl(profile.background_video_url);
    } else if (profileUserId && !profile) {
      // If we have profileUserId but no profile yet, fetch it
      console.log('Fetching profile for user:', profileUserId);
      fetchOtherUserProfile();
    }
  }, [profileUserId, user, profile]);

  const fetchOtherUserProfile = async () => {
    if (!profileUserId) return;

    console.log('Fetching video URL for user:', profileUserId);
    const { data, error } = await supabase
      .from('profiles')
      .select('background_video_url')
      .eq('user_id', profileUserId)
      .single();

    console.log('Fetched video data:', data, 'Error:', error);
    if (data) {
      setProfileVideoUrl(data.background_video_url);
    }
  };

  console.log('VideoBackground render:', { 
    profileUserId, 
    userAuthId: user?.id, 
    hasProfile: !!profile,
    profileVideoUrl,
    profileBgVideo: profile?.background_video_url 
  });

  if (!profileVideoUrl) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
    );
  }

  // Check if the URL is an image or video
  const isImage = profileVideoUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i);

  return (
    <>
      {isImage ? (
        <div 
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none"
          style={{ 
            backgroundImage: `url(${profileVideoUrl})`,
            zIndex: -1 
          }}
        />
      ) : (
        <video
          key={profileVideoUrl} // Force re-render when URL changes
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ zIndex: -1 }}
          onError={(e) => {
            console.error('Video load error:', e);
            console.error('Failed video URL:', profileVideoUrl);
          }}
          onLoadStart={() => console.log('Video load started:', profileVideoUrl)}
          onCanPlay={() => console.log('Video can play:', profileVideoUrl)}
          onLoadedData={() => console.log('Video loaded data:', profileVideoUrl)}
        >
          <source src={profileVideoUrl} type="video/mp4" />
        </video>
      )}
      {/* Overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/30 pointer-events-none" />
      {/* Gradient overlay for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 pointer-events-none" />
    </>
  );
};

export default VideoBackground;