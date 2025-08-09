import { SocialLinks } from '@/components/SocialLinks';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ViewStats from '@/components/ViewStats';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import { Settings, LogOut } from 'lucide-react';

// Default fallback values
const DEFAULT_USERNAME = "anonymous";
const DEFAULT_BIO = "digital wanderer";

const Index = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  const isLoading = authLoading || profileLoading;

  // Use profile data if available, otherwise use defaults
  const username = profile?.username || DEFAULT_USERNAME;
  const bio = profile?.bio || DEFAULT_BIO;
  
  const handleSignOut = async () => {
    await signOut();
  };

  // If not authenticated, show login landing page
  if (!isLoading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-smoke-950 to-background flex items-center justify-center p-6">
        <OptimizedVideoBackground />
        
        <div className="relative z-10 w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl font-black">
                <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                  Enter the hideout
                </span>
              </h1>
              <p className="text-smoke-400 text-sm leading-relaxed max-w-sm mx-auto">
                Create your minimal digital presence in the shadows
              </p>
            </div>
            
            {/* Minimal accent line */}
            <div className="w-8 h-px bg-smoke-600 mx-auto" />
          </div>

          {/* Login Actions */}
          <div className="space-y-4">
            <Button 
              onClick={() => navigate('/auth')} 
              size="lg"
              className="w-full glass hover-lift bg-smoke-800/50 text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50 h-12"
            >
              Sign In
            </Button>
            
            <Button 
              onClick={() => navigate('/auth')} 
              variant="ghost"
              size="lg"
              className="w-full glass text-smoke-300 hover:text-smoke-100 border-smoke-700/20 hover:bg-smoke-800/30 h-12"
            >
              Create Account
            </Button>
          </div>

          {/* Features Preview */}
          <div className="space-y-4 pt-4">
            <div className="text-center">
              <p className="text-xs text-smoke-500 font-mono mb-4">what you get</p>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-smoke-400 text-sm">
                <div className="w-1 h-1 bg-smoke-500 rounded-full" />
                <span>Your own custom URL</span>
              </div>
              <div className="flex items-center gap-3 text-smoke-400 text-sm">
                <div className="w-1 h-1 bg-smoke-500 rounded-full" />
                <span>Social links & portfolio</span>
              </div>
              <div className="flex items-center gap-3 text-smoke-400 text-sm">
                <div className="w-1 h-1 bg-smoke-500 rounded-full" />
                <span>Custom themes & cursors</span>
              </div>
              <div className="flex items-center gap-3 text-smoke-400 text-sm">
                <div className="w-1 h-1 bg-smoke-500 rounded-full" />
                <span>Video backgrounds</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center pt-6">
            <p className="text-xs text-smoke-500 font-mono">
              bold but subtle, raw but refined
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center">
        <OptimizedVideoBackground />
        <div className="relative z-10 text-smoke-300 animate-pulse text-sm font-light tracking-wider">
          loading...
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      {/* Optimized Video Background */}
      <OptimizedVideoBackground profileUserId={user?.id} />
      
      {/* Cursor Style */}
      <CursorStyle profileUserId={user?.id} />
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                  {username}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-smoke-400 font-light tracking-wide max-w-md mx-auto">
                {bio}
              </p>
            </div>
            
            {/* Minimal accent */}
            <div className="w-8 h-px bg-smoke-600 mx-auto" />
          </div>

          {/* Profile URL - Subtle */}
          {user && profile && (
            <div className="text-center animate-fade-in-delay">
              <p className="text-xs text-smoke-500 font-mono">
                {window.location.origin}/{profile.username}
              </p>
            </div>
          )}

          {/* View Statistics */}
          <div className="animate-fade-in-delay">
            <ViewStats profileUserId={user?.id} />
          </div>

          {/* Actions - Minimal and refined */}
          {user && (
            <div className="flex justify-center gap-2 animate-fade-in-delay">
              <Button 
                variant="ghost"
                size="sm"
                onClick={() => navigate('/settings')}
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
          )}

          {/* Social Links - Refined presentation */}
          <div className="animate-fade-in-delay">
            {socialLinks.length > 0 ? (
              <div className="flex flex-wrap justify-center gap-2">
                {socialLinks
                  .filter(link => link.is_visible)
                  .sort((a, b) => a.order_index - b.order_index)
                  .map((link) => (
                    <Button
                      key={link.id}
                      variant="ghost"
                      size="sm"
                      asChild
                      className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/20"
                    >
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2"
                      >
                        {link.name}
                      </a>
                    </Button>
                  ))}
              </div>
            ) : (
              <SocialLinks />
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
