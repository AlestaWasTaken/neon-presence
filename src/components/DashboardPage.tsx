import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate } from 'react-router-dom';
import { DashboardSidebar } from '@/components/DashboardSidebar';
import { AccountOverview } from '@/components/AccountOverview';
import { CustomizePage } from '@/components/CustomizePage';
import ViewAnalytics from '@/components/ViewAnalytics';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading, updateProfile, addSocialLink, deleteSocialLink } = useProfile();
  
  const [activeSection, setActiveSection] = useState('customize');
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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-gray-300 animate-pulse text-sm font-light tracking-wider">
          Loading...
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
      toast.success('Profil başarıyla güncellendi!');
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Profil güncellenirken hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizationSettings(prev => ({ ...prev, [key]: value }));
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'account':
        return <AccountOverview profile={profile} />;
      case 'customize':
        return (
          <CustomizePage
            formData={formData}
            setFormData={setFormData}
            customizationSettings={customizationSettings}
            handleCustomizationChange={handleCustomizationChange}
            onSave={handleSave}
            isSaving={isSaving}
          />
        );
      case 'links':
        return <ViewAnalytics profileUserId={user?.id} />;
      case 'premium':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Premium Features</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'image-host':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Image Host</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      case 'templates':
        return (
          <div className="text-center py-20">
            <h2 className="text-2xl font-bold text-white mb-4">Templates</h2>
            <p className="text-gray-400">Coming soon...</p>
          </div>
        );
      default:
        return (
          <CustomizePage
            formData={formData}
            setFormData={setFormData}
            customizationSettings={customizationSettings}
            handleCustomizationChange={handleCustomizationChange}
            onSave={handleSave}
            isSaving={isSaving}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        profile={profile}
      />
      
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </main>
      
      <Toaster />
    </div>
  );
}