import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { useViewStats } from '@/hooks/useViewStats';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import VideoBackground from '@/components/VideoBackground';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';
import ViewStats from '@/components/ViewStats';
import { Settings, LogOut, User } from 'lucide-react';
import { useEffect } from 'react';

export default function HomePage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading } = useProfile();
  const { recordView } = useViewStats();

  const loading = authLoading || profileLoading;

  // Record view when page loads
  useEffect(() => {
    if (user?.id) {
      recordView(user.id);
    }
  }, [user?.id, recordView]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center">
        <VideoBackground />
        <div className="relative z-10 text-smoke-300 animate-pulse text-sm font-light tracking-wider">
          yükleniyor...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const username = profile?.username || user?.user_metadata?.username || "kullanıcı";
  const bio = profile?.bio || "dijital alemde gezinen bir ruh...";

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      <VideoBackground profileUserId={user?.id} />
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-2xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Avatar */}
            {profile?.avatar_url && (
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-smoke-600/30 animate-scale-in">
                  <img 
                    src={profile.avatar_url} 
                    alt={`${username}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
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
            
            <div className="w-8 h-px bg-smoke-600 mx-auto" />
          </div>

          {/* Profile URL */}
          {profile && (
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

          {/* Actions */}
          <div className="flex justify-center gap-3 animate-fade-in-delay">
            <Button 
              asChild
              variant="ghost"
              size="sm"
              className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/30"
            >
              <Link to="/dashboard">
                <Settings className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
            
            <Button 
              asChild
              variant="ghost"
              size="sm"
              className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/30"
            >
              <Link to={`/${profile?.username || 'profile'}`}>
                <User className="h-4 w-4 mr-2" />
                Profilim
              </Link>
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

          {/* Social Links */}
          <div className="animate-fade-in-delay">
            <SocialLinksDisplay socialLinks={socialLinks} />
          </div>

        </div>
      </div>
    </div>
  );
}