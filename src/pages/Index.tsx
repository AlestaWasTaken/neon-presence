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
        
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-black text-gradient">
            Create Your Profile
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to create your personal landing page
          </p>
          <Button onClick={() => navigate('/auth')} size="lg">
            Sign In / Sign Up
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-foreground animate-pulse text-xl">Loading...</div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-950">
      {/* Video Background */}
      <VideoBackground profileUserId={user?.id} />
      
      {/* Cursor Style */}
      <CursorStyle profileUserId={user?.id} />
      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                <span className="text-gradient">{username}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-light tracking-wide">
                {bio}
              </p>
            </div>
            
            {/* Minimal decorative line */}
            <div className="w-16 h-px bg-gradient-primary mx-auto" />
          </div>

          {/* Profile URL Info */}
          {user && profile && (
            <div className="text-center animate-fade-in">
              <p className="text-sm text-muted-foreground">
                Your profile:{' '}
                <span className="text-foreground font-mono">
                  {window.location.origin}/{profile.username}
                </span>
              </p>
            </div>
          )}

          {/* View Statistics - Only for profile owner */}
          <ViewStats profileUserId={user?.id} />

          {/* User Actions */}
          {user && (
            <div className="flex justify-center gap-3">
              <Button 
                variant="default" 
                onClick={() => navigate('/settings')}
                className="flex items-center gap-2"
              >
                Settings
              </Button>
              <ViewAnalytics />
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          )}

          {/* Social Links - Show user's custom links if available */}
          {socialLinks.length > 0 ? (
            <div className="flex flex-wrap justify-center gap-3">
              {socialLinks
                .filter(link => link.is_visible)
                .sort((a, b) => a.order_index - b.order_index)
                .map((link) => (
                  <Button
                    key={link.id}
                    variant="outline"
                    size="lg"
                    asChild
                    className="group transition-all duration-200 hover:scale-105 shadow-subtle hover:shadow-medium"
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-6 py-3"
                    >
                      <span className="font-medium">{link.name}</span>
                    </a>
                  </Button>
                ))}
            </div>
          ) : (
            <SocialLinks />
          )}

          {/* Footer */}
          <div className="text-center pt-8 animate-fade-in-delay">
            <p className="text-sm text-muted-foreground">
              Minimal profile page
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
