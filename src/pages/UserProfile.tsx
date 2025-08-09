import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { DiscordStatus } from '@/components/DiscordStatus';
import { useAuth } from '@/hooks/useAuth';
import { useProfileViews } from '@/hooks/useProfileViews';
import { Button } from '@/components/ui/button';
import ProfileSettings from '@/components/ProfileSettings';
import ViewStats from '@/components/ViewStats';
import ViewAnalytics from '@/components/ViewAnalytics';
import { LogOut, ArrowLeft } from 'lucide-react';

interface UserProfileData {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  primary_color: string;
  accent_color: string;
  theme: 'neon' | 'minimal' | 'cyberpunk';
  view_count: number;
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon animate-pulse text-xl">Yükleniyor...</div>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-4xl font-black text-neon">
            Kullanıcı Bulunamadı
          </h1>
          <p className="text-lg text-muted-foreground">
            @{username} kullanıcı adına sahip bir profil bulunamadı.
          </p>
          <Button onClick={() => navigate('/')} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Ana Sayfaya Dön
          </Button>
        </div>
      </div>
    );
  }

  if (!profileData) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                <span className="text-neon animate-pulse-neon">{profileData.username}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-light tracking-wide">
                {profileData.bio || 'Bu kullanıcı henüz bir bio eklememış.'}
              </p>
            </div>
            
            {/* Decorative line */}
            <div className="w-24 h-0.5 bg-gradient-primary mx-auto rounded-full" />
          </div>

          {/* View Statistics - Show for both own profile and public view */}
          <div className="flex justify-center gap-4 animate-fade-in">
            <div className="bg-card/50 backdrop-blur border-primary/20 rounded-lg px-4 py-2 border">
              <span className="text-sm font-medium">
                👀 {viewCount} görüntüleme
              </span>
            </div>
            <div className="bg-card/50 backdrop-blur border-primary/20 rounded-lg px-4 py-2 border">
              <span className="text-sm font-medium">
                🟢 {activeViewers} aktif ziyaretçi
              </span>
            </div>
          </div>

          {/* User Actions - Only show if it's own profile */}
          {isOwnProfile && (
            <div className="flex justify-center gap-4">
              <ProfileSettings />
              <ViewAnalytics />
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Çıkış Yap
              </Button>
            </div>
          )}

          {/* Back to home if not own profile */}
          {!isOwnProfile && (
            <div className="flex justify-center">
              <Button 
                variant="outline" 
                onClick={() => navigate('/')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Ana Sayfa
              </Button>
            </div>
          )}

          {/* Discord Status */}
          <DiscordStatus userId={DEFAULT_DISCORD_ID} />

          {/* Social Links */}
          {socialLinks.length > 0 && (
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks
                .sort((a, b) => a.order_index - b.order_index)
                .map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="lg"
                    asChild
                    className="group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3"
                      style={{ color: link.color }}
                    >
                      <span className="text-lg font-medium">{link.name}</span>
                    </a>
                  </Button>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="text-center pt-8 animate-fade-in-delay-2">
            <p className="text-sm text-muted-foreground">
              Profil sahibi: <span className="text-neon">@{profileData.username}</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default UserProfile;