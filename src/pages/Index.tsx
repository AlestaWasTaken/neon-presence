import { DiscordStatus } from '@/components/DiscordStatus';
import { SocialLinks } from '@/components/SocialLinks';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ProfileSettings from '@/components/ProfileSettings';
import ViewStats from '@/components/ViewStats';
import ViewAnalytics from '@/components/ViewAnalytics';
import VideoBackground from '@/components/VideoBackground';
import CursorStyle from '@/components/CursorStyle';
import VideoTestButton from '@/components/VideoTestButton';
import { LogOut } from 'lucide-react';

// Default fallback values
const DEFAULT_DISCORD_ID = "YOUR_DISCORD_ID";
const DEFAULT_USERNAME = "username";
const DEFAULT_BIO = "digital nomad / hacker / dreamer";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const isLoading = authLoading || profileLoading;

  // Use profile data if available, otherwise use defaults
  const username = profile?.username || DEFAULT_USERNAME;
  const bio = profile?.bio || DEFAULT_BIO;
  const discordId = DEFAULT_DISCORD_ID; // This could be added to profile later
  
  const handleSignOut = async () => {
    await signOut();
  };

  // If not authenticated, show login prompt
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
        
        <div className="relative z-10 text-center space-y-6">
          <h1 className="text-4xl font-black text-neon">
            Profilinizi Özelleştirin
          </h1>
          <p className="text-lg text-muted-foreground">
            Kendi kişisel landing sayfanızı oluşturmak için giriş yapın
          </p>
          <Button onClick={() => navigate('/auth')} size="lg">
            Giriş Yap / Kayıt Ol
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-neon animate-pulse text-xl">Yükleniyor...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background">
      {/* Video Background or Gradient */}
      <VideoBackground profileUserId={user?.id} />
      
      {/* Cursor Style */}
      <CursorStyle profileUserId={user?.id} />
      
      {/* Video Test Button - only for logged in users */}
      {user && <VideoTestButton />}
      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                <span className="text-neon animate-pulse-neon">{username}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-light tracking-wide">
                {bio}
              </p>
            </div>
            
            {/* Decorative line */}
            <div className="w-24 h-0.5 bg-gradient-primary mx-auto rounded-full" />
          </div>

          {/* Profile URL Info */}
          {user && profile && (
            <div className="text-center animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Profiliniz: {' '}
                <span className="text-neon font-mono">
                  {window.location.origin}/{profile.username}
                </span>
              </p>
            </div>
          )}

          {/* View Statistics - Only for profile owner */}
          <ViewStats profileUserId={user?.id} />

          {/* User Actions */}
          {user && (
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

          {/* Discord Status */}
          <DiscordStatus userId={discordId} />

          {/* Social Links - Show user's custom links if available */}
          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-4">
              {socialLinks
                .filter(link => link.is_visible)
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
          ) : (
            <SocialLinks />
          )}

          {/* Footer */}
          <div className="text-center pt-8 animate-fade-in-delay-2">
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-neon-pink">♥</span> and inspired by{' '}
              <a 
                href="https://guns.lol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow transition-colors duration-300 underline underline-offset-4"
              >
                guns.lol
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
