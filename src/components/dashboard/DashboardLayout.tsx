import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import { DashboardSidebar } from './DashboardSidebar';
import { DashboardContent } from './DashboardContent';
import VideoBackground from '@/components/VideoBackground';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout() {
  const { user, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading, updateProfile, addSocialLink, deleteSocialLink } = useProfile();
  
  const [activeSection, setActiveSection] = useState('overview');
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    background_video_url: '',
    audio_url: '',
    avatar_url: '',
    custom_cursor_url: '',
    primary_color: '#000000',
    accent_color: '#ffffff',
    theme: 'dark' as 'dark' | 'light' | 'system',
    cursor_style: 'default' as 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom',
  });

  const [customizationSettings, setCustomizationSettings] = useState({
    accentColor: '#000000',
    textColor: '#ffffff',
    backgroundColor: '#111111',
    iconColor: '#666666',
    profileOpacity: 100,
    profileBlur: 0,
    enableGradient: false,
    monochromeIcons: false,
    animatedTitle: false,
    volumeControl: true,
    location: '',
    backgroundEffect: 'none' as 'none' | 'rain' | 'snow' | 'particles',
    usernameEffect: 'none' as 'none' | 'glow' | 'shadow' | 'neon',
  });

  const loading = authLoading || profileLoading;

  // Update form when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        background_video_url: profile.background_video_url || '',
        audio_url: profile.audio_url || '',
        avatar_url: profile.avatar_url || '',
        custom_cursor_url: profile.custom_cursor_url || '',
        primary_color: profile.primary_color || '#000000',
        accent_color: profile.accent_color || '#ffffff',
        theme: profile.theme || 'dark',
        cursor_style: profile.cursor_style || 'default',
      });

      // Map profile data to customization settings
      setCustomizationSettings(prev => ({
        ...prev,
        accentColor: profile.primary_color || '#000000',
        textColor: profile.accent_color || '#ffffff',
        backgroundEffect: profile.background_effect || 'none',
        usernameEffect: profile.username_effect || 'none',
        location: profile.location || '',
        profileOpacity: profile.profile_opacity || 100,
        profileBlur: profile.profile_blur || 0,
        enableGradient: profile.enable_gradient || false,
        monochromeIcons: profile.monochrome_icons || false,
        animatedTitle: profile.animated_title || false,
        volumeControl: profile.volume_control !== undefined ? profile.volume_control : true,
      }));
    }
  }, [profile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-smoke-950 via-background to-smoke-900 flex items-center justify-center">
        <div className="glass rounded-2xl p-8 text-center">
          <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white/80 font-medium">Loading Dashboard...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile({
        ...formData,
        primary_color: customizationSettings.accentColor,
        accent_color: customizationSettings.textColor,
        background_effect: customizationSettings.backgroundEffect,
        username_effect: customizationSettings.usernameEffect,
        location: customizationSettings.location,
        profile_opacity: customizationSettings.profileOpacity,
        profile_blur: customizationSettings.profileBlur,
        enable_gradient: customizationSettings.enableGradient,
        monochrome_icons: customizationSettings.monochromeIcons,
        animated_title: customizationSettings.animatedTitle,
        volume_control: customizationSettings.volumeControl,
      });
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizationSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-smoke-950 via-background to-smoke-900">
      {/* Video Background */}
      <div className="fixed inset-0 z-0">
        <VideoBackground profileUserId={user?.id} />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>
      
      <div className="relative z-10 flex min-h-screen">
        <DashboardSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          profile={profile}
        />
        
        <main className="flex-1 overflow-y-auto">
          <DashboardContent
            activeSection={activeSection}
            profile={profile}
            formData={formData}
            setFormData={setFormData}
            customizationSettings={customizationSettings}
            handleCustomizationChange={handleCustomizationChange}
            onSave={handleSave}
            isSaving={isSaving}
            user={user}
          />
        </main>
      </div>
      
      <Toaster />
    </div>
  );
}