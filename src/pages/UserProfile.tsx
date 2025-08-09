import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DiscordStatus } from '@/components/DiscordStatus';
import { useAuth } from '@/hooks/useAuth';
import { useProfileViews } from '@/hooks/useProfileViews';
import { Button } from '@/components/ui/button';
import EmbeddedView from '@/components/EmbeddedView';
import ProfileSettings from '@/components/ProfileSettings';
import ViewAnalytics from '@/components/ViewAnalytics';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';
import { LogOut, ArrowLeft, Settings } from 'lucide-react';

interface UserProfileData {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  primary_color: string;
  accent_color: string;
  theme: 'neon' | 'minimal' | 'cyberpunk';
  view_count: number;
  background_video_url: string | null;
  cursor_style: 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom';
  custom_cursor_url: string | null;
  avatar_url: string | null;
}

interface UserSocialLink {
  id: string;
  user_id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  is_visible: boolean;
  order_index: number;
}

const UserProfile = () => {
  const { username } = useParams<{ username: string }>();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState<UserProfileData | null>(null);
  const [socialLinks, setSocialLinks] = useState<UserSocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Use profile views hook for the found user
  const { viewCount, activeViewers } = useProfileViews(profileData?.user_id);

  useEffect(() => {
    if (username) {
      fetchUserProfile();
    }
  }, [username]);

  const fetchUserProfile = async () => {
    if (!username) return;

    setLoading(true);
    
    // Fetch user profile by username
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (error || !profile) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setProfileData(profile as UserProfileData);

    // Fetch social links for this user
    const { data: links } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', profile.user_id)
      .eq('is_visible', true)
      .order('order_index');

    setSocialLinks(links || []);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isOwnProfile = user && profileData && user.id === profileData.user_id;

  // Default Discord ID - this could be made configurable per user
  const DEFAULT_DISCORD_ID = "YOUR_DISCORD_ID";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center">
        <OptimizedVideoBackground />
        <div className="relative z-10 text-smoke-300 animate-pulse text-sm font-light tracking-wider">
          loading...
        </div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center p-6">
        <OptimizedVideoBackground />
        
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                User not found
              </span>
            </h1>
            <p className="text-smoke-400 text-sm leading-relaxed">
              @{username} doesn't exist in this hideout
            </p>
          </div>
          
          <Button 
            onClick={() => navigate('/')} 
            size="sm"
            className="glass hover-lift bg-smoke-800/50 text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to hideout
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      {/* Video Background */}
      <OptimizedVideoBackground profileUserId={profileData?.user_id} />
      
      {/* Cursor Style */}
      <CursorStyle profileUserId={profileData?.user_id} />
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Avatar */}
            {profileData.avatar_url && (
              <div className="flex justify-center">
                <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-smoke-600/30 animate-scale-in">
                  <img 
                    src={profileData.avatar_url} 
                    alt={`${profileData.username}'s avatar`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                  {profileData.username}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-smoke-400 font-light tracking-wide max-w-md mx-auto">
                {profileData.bio || 'digital wanderer'}
              </p>
            </div>
            
            {/* Minimal accent */}
            <div className="w-8 h-px bg-smoke-600 mx-auto" />
          </div>

          {/* Actions - Minimal and refined */}
          {isOwnProfile ? (
            <div className="flex justify-center gap-2 animate-fade-in-delay">
                <Button 
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/dashboard')}
                  className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/30"
                >
                  <Settings className="h-4 w-4 mr-2" />
                  Customize
                </Button>
              <Button 
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-smoke-400 hover:text-smoke-200"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="flex justify-center animate-fade-in-delay">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate('/')}
                className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to hideout
              </Button>
            </div>
          )}

          {/* Social Links - Refined presentation */}
          <div className="animate-fade-in-delay">
            <SocialLinksDisplay socialLinks={socialLinks} />
          </div>

          {/* Footer */}
          <div className="text-center pt-12 animate-fade-in-delay-2">
            <p className="text-xs text-smoke-500 font-mono">
              {window.location.origin}/{profileData.username}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;