import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Profile, SocialLink } from '@/types';
import { useViewStats } from '@/hooks/useViewStats';
import VideoBackground from '@/components/VideoBackground';
import { SocialLinksDisplay } from '@/components/SocialLinksDisplay';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  
  const { recordView } = useViewStats();

  useEffect(() => {
    if (username) {
      fetchProfile();
    }
  }, [username]);

  const fetchProfile = async () => {
    if (!username) return;

    try {
      // Fetch profile by username
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', username)
        .single();

      if (profileError || !profileData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setProfile(profileData);

      // Record view
      await recordView(profileData.user_id);

      // Fetch social links
      const { data: linksData } = await supabase
        .from('social_links')
        .select('*')
        .eq('user_id', profileData.user_id)
        .eq('is_visible', true)
        .order('order_index');

      setSocialLinks(linksData || []);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

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

  if (notFound || !profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center p-6">
        <VideoBackground />
        
        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl font-black">
              <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                Kullanıcı bulunamadı
              </span>
            </h1>
            <p className="text-smoke-400 text-sm leading-relaxed">
              @{username} bu hideout'ta mevcut değil
            </p>
          </div>
          
          <Button asChild size="sm" className="glass hover-lift bg-smoke-800/50 text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Ana Sayfaya Dön
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      <VideoBackground profileUserId={profile.user_id} />
      
      <div className="relative z-10 container mx-auto px-6 py-16 sm:py-24">
        <div className="max-w-xl mx-auto space-y-12">
          
          {/* Header Section */}
          <div className="text-center space-y-8 animate-fade-in">
            {/* Avatar */}
            {profile.avatar_url && (
              <div className="flex justify-center">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-smoke-600/30 animate-scale-in">
                  <img 
                    src={profile.avatar_url} 
                    alt={`${profile.username}'s avatar`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none">
                <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                  {profile.username}
                </span>
              </h1>
              <p className="text-base sm:text-lg text-smoke-400 font-light tracking-wide max-w-md mx-auto">
                {profile.bio || 'dijital alemde gezinen bir ruh...'}
              </p>
            </div>
            
            <div className="w-8 h-px bg-smoke-600 mx-auto" />
          </div>

          {/* Social Links */}
          <div className="animate-fade-in-delay">
            <SocialLinksDisplay socialLinks={socialLinks} />
          </div>

          {/* Back button */}
          <div className="flex justify-center animate-fade-in-delay">
            <Button asChild variant="ghost" size="sm" className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/30">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfaya Dön
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-12 animate-fade-in-delay">
            <p className="text-xs text-smoke-500 font-mono">
              {window.location.origin}/{profile.username}
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}