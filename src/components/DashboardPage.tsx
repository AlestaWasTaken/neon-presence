import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import VideoBackground from '@/components/VideoBackground';
import ViewAnalytics from '@/components/ViewAnalytics';
import { MediaUploader } from '@/components/MediaUploader';
import ColorCustomizer from '@/components/ColorCustomizer';
import { 
  Settings, 
  User, 
  Link as LinkIcon, 
  Eye, 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Upload,
  Palette,
  Music,
  Image,
  Video,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone,
  RotateCcw,
  Volume2,
  Sparkles,
  MapPin
} from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading, updateProfile, addSocialLink, deleteSocialLink } = useProfile();
  
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

  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    icon: 'globe',
  });

  const [isSaving, setIsSaving] = useState(false);

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

  const handleAddLink = async () => {
    if (!newLink.name || !newLink.url) return;
    
    try {
      await addSocialLink({
        ...newLink,
        color: '#ffffff',
        is_visible: true,
        order_index: socialLinks.length,
      });
      setNewLink({ name: '', url: '', icon: 'globe' });
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleCustomizationChange = (key: string, value: any) => {
    setCustomizationSettings(prev => ({ ...prev, [key]: value }));
  };

  const iconOptions = [
    { value: 'globe', label: 'Website', icon: Globe },
    { value: 'github', label: 'GitHub', icon: Github },
    { value: 'twitter', label: 'Twitter', icon: Twitter },
    { value: 'instagram', label: 'Instagram', icon: Instagram },
    { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
    { value: 'youtube', label: 'YouTube', icon: Youtube },
    { value: 'mail', label: 'Email', icon: Mail },
    { value: 'phone', label: 'Telefon', icon: Phone },
    { value: 'link', label: 'Özel Link', icon: LinkIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      <VideoBackground profileUserId={user?.id} />
      
      <div className="relative z-10 container mx-auto px-6 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-smoke-400 text-sm mt-1">
                Profilini tamamen özelleştir ve analitiklerini gör
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
              </Button>
              <Button asChild variant="ghost" size="sm" className="glass border-smoke-700/30">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Ana Sayfa
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="assets" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 glass border-smoke-700/30">
              <TabsTrigger value="assets" className="flex items-center gap-2">
                <Upload className="h-4 w-4" />
                Medya
              </TabsTrigger>
              <TabsTrigger value="customization" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Özelleştirme
              </TabsTrigger>
              <TabsTrigger value="colors" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Renkler
              </TabsTrigger>
              <TabsTrigger value="links" className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                Linkler
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Analitik
              </TabsTrigger>
            </TabsList>

            {/* Assets Uploader Tab */}
            <TabsContent value="assets" className="space-y-6">
              <div className="space-y-6">
                <div className="text-center p-6 glass border-smoke-700/30 rounded-lg">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-smoke-300" />
                  <h2 className="text-xl font-bold text-smoke-100 mb-2">Medya Yükleyici</h2>
                  <p className="text-smoke-400">
                    Arka plan, ses, profil resmi ve özel cursor dosyalarını yükle
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <MediaUploader
                    type="background"
                    currentUrl={formData.background_video_url}
                    onUpload={(url) => setFormData(prev => ({ ...prev, background_video_url: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, background_video_url: '' }))}
                  />
                  
                  <MediaUploader
                    type="audio"
                    currentUrl={formData.audio_url}
                    onUpload={(url) => setFormData(prev => ({ ...prev, audio_url: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, audio_url: '' }))}
                  />
                  
                  <MediaUploader
                    type="avatar"
                    currentUrl={formData.avatar_url}
                    onUpload={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, avatar_url: '' }))}
                  />
                  
                  <MediaUploader
                    type="cursor"
                    currentUrl={formData.custom_cursor_url}
                    onUpload={(url) => setFormData(prev => ({ ...prev, custom_cursor_url: url }))}
                    onRemove={() => setFormData(prev => ({ ...prev, custom_cursor_url: '' }))}
                  />
                </div>
              </div>
            </TabsContent>

            {/* General Customization Tab */}
            <TabsContent value="customization" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Basic Info */}
                <Card className="glass border-smoke-700/30">
                  <CardHeader>
                    <CardTitle className="text-smoke-100 flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Genel Özelleştirme
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Açıklama</Label>
                      <Textarea
                        id="description"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="marketing director & designer"
                        rows={3}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Profil Opaklığı</Label>
                        <span className="text-sm text-smoke-400">{customizationSettings.profileOpacity}%</span>
                      </div>
                      <Slider
                        value={[customizationSettings.profileOpacity]}
                        onValueChange={(value) => handleCustomizationChange('profileOpacity', value[0])}
                        max={100}
                        min={0}
                        step={5}
                      />
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Label>Profil Bulanıklığı</Label>
                        <span className="text-sm text-smoke-400">{customizationSettings.profileBlur}px</span>
                      </div>
                      <Slider
                        value={[customizationSettings.profileBlur]}
                        onValueChange={(value) => handleCustomizationChange('profileBlur', value[0])}
                        max={20}
                        min={0}
                        step={1}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Arka Plan Efektleri</Label>
                      <Select
                        value={customizationSettings.backgroundEffect}
                        onValueChange={(value) => handleCustomizationChange('backgroundEffect', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Yok</SelectItem>
                          <SelectItem value="rain">Yağmur</SelectItem>
                          <SelectItem value="snow">Kar</SelectItem>
                          <SelectItem value="particles">Parçacık</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Kullanıcı Adı Efektleri</Label>
                      <Select
                        value={customizationSettings.usernameEffect}
                        onValueChange={(value) => handleCustomizationChange('usernameEffect', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Yok</SelectItem>
                          <SelectItem value="glow">Işık</SelectItem>
                          <SelectItem value="shadow">Gölge</SelectItem>
                          <SelectItem value="neon">Neon</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Konum</Label>
                      <div className="flex gap-2">
                        <MapPin className="w-5 h-5 text-smoke-400 mt-2" />
                        <Input
                          id="location"
                          value={customizationSettings.location}
                          onChange={(e) => handleCustomizationChange('location', e.target.value)}
                          placeholder="İstanbul"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Other Customization */}
                <Card className="glass border-smoke-700/30">
                  <CardHeader>
                    <CardTitle className="text-smoke-100 flex items-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Diğer Özelleştirmeler
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Image className="w-4 h-4" />
                        Monokrom İkonlar
                      </Label>
                      <Switch
                        checked={customizationSettings.monochromeIcons}
                        onCheckedChange={(checked) => handleCustomizationChange('monochromeIcons', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        Animasyonlu Başlık
                      </Label>
                      <Switch
                        checked={customizationSettings.animatedTitle}
                        onCheckedChange={(checked) => handleCustomizationChange('animatedTitle', checked)}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        <Volume2 className="w-4 h-4" />
                        Ses Kontrolü
                      </Label>
                      <Switch
                        checked={customizationSettings.volumeControl}
                        onCheckedChange={(checked) => handleCustomizationChange('volumeControl', checked)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Cursor Stili</Label>
                      <Select
                        value={formData.cursor_style}
                        onValueChange={(value) => setFormData(prev => ({ ...prev, cursor_style: value as any }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="default">Varsayılan</SelectItem>
                          <SelectItem value="pointer">Pointer</SelectItem>
                          <SelectItem value="crosshair">Artı İşareti</SelectItem>
                          <SelectItem value="neon-dot">Neon Nokta</SelectItem>
                          <SelectItem value="custom">Özel</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Color Customization Tab */}
            <TabsContent value="colors" className="space-y-6">
              <ColorCustomizer
                onColorChange={handleCustomizationChange}
                currentColors={{
                  primary_color: customizationSettings.accentColor,
                  accent_color: customizationSettings.textColor,
                  theme: formData.theme
                }}
              />
            </TabsContent>

            {/* Links Tab */}
            <TabsContent value="links" className="space-y-6">
              <Card className="glass border-smoke-700/30">
                <CardHeader>
                  <CardTitle className="text-smoke-100">Sosyal Linkler</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Add new link */}
                  <div className="space-y-4 p-4 rounded-lg bg-smoke-900/30 border border-smoke-700/30">
                    <h3 className="text-sm font-medium text-smoke-200">Yeni Link Ekle</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="link-name">Ad</Label>
                        <Input
                          id="link-name"
                          value={newLink.name}
                          onChange={(e) => setNewLink(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Website"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link-url">URL</Label>
                        <Input
                          id="link-url"
                          value={newLink.url}
                          onChange={(e) => setNewLink(prev => ({ ...prev, url: e.target.value }))}
                          placeholder="https://example.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="link-icon">İkon</Label>
                        <Select
                          value={newLink.icon}
                          onValueChange={(value) => setNewLink(prev => ({ ...prev, icon: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {iconOptions.map(option => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button onClick={handleAddLink} disabled={!newLink.name || !newLink.url} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Ekle
                    </Button>
                  </div>

                  {/* Existing links */}
                  <div className="space-y-3">
                    {socialLinks.length === 0 ? (
                      <div className="text-center py-8 text-smoke-400">
                        Henüz link eklenmemiş
                      </div>
                    ) : (
                      socialLinks.map((link) => (
                        <div key={link.id} className="flex items-center gap-3 p-3 rounded-lg bg-smoke-900/20 border border-smoke-700/20">
                          <div className="flex-1">
                            <p className="font-medium text-smoke-200">{link.name}</p>
                            <p className="text-sm text-smoke-400 truncate">{link.url}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteSocialLink(link.id)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <ViewAnalytics profileUserId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
