import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, EyeOff, Save, RotateCcw, Upload, Video, Image, Music } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ColorCustomizer from '@/components/ColorCustomizer';

const ProfileSettings = () => {
  const { profile, socialLinks, updateProfile, addSocialLink, updateSocialLink, deleteSocialLink } = useProfile();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    primary_color: '0 0% 96%',
    accent_color: '0 0% 10%',
    theme: 'dark' as 'dark' | 'light' | 'system',
    background_video_url: '',
    audio_url: '',
    cursor_style: 'default' as 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom',
    custom_cursor_url: ''
  });

  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    icon: 'globe',
    color: '#ffffff'
  });

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        primary_color: profile.primary_color || '0 0% 96%',
        accent_color: profile.accent_color || '0 0% 10%',
        theme: profile.theme || 'dark',
        background_video_url: profile.background_video_url || '',
        audio_url: profile.audio_url || '',
        cursor_style: profile.cursor_style || 'default',
        custom_cursor_url: profile.custom_cursor_url || ''
      });
      setHasChanges(false);
    }
  }, [profile]);

  if (!profile) return null;

  const handleFormChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    
    // Apply color changes immediately to CSS variables
    if (field === 'primary_color') {
      document.documentElement.style.setProperty('--primary', value);
    } else if (field === 'accent_color') {
      document.documentElement.style.setProperty('--accent', value);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateProfile(formData);
      setHasChanges(false);
      toast({
        title: "Profil güncellendi",
        description: "Değişiklikler başarıyla kaydedildi."
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Profil güncellenirken bir hata oluştu."
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (profile) {
      setFormData({
        username: profile.username || '',
        bio: profile.bio || '',
        primary_color: profile.primary_color || '0 0% 96%',
        accent_color: profile.accent_color || '0 0% 10%',
        theme: profile.theme || 'dark',
        background_video_url: profile.background_video_url || '',
        audio_url: profile.audio_url || '',
        cursor_style: profile.cursor_style || 'default',
        custom_cursor_url: profile.custom_cursor_url || ''
      });
      setHasChanges(false);
    }
  };

  const handleAddLink = () => {
    if (newLink.name && newLink.url) {
      addSocialLink({
        ...newLink,
        is_visible: true,
        order_index: socialLinks.length
      });
      setNewLink({ name: '', url: '', icon: 'globe', color: '#ffffff' });
    }
  };

  const iconOptions = [
    { value: 'globe', label: 'Website / Custom URL' },
    { value: 'link', label: 'Custom Link' },
    { value: 'github', label: 'GitHub' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'twitch', label: 'Twitch' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'discord', label: 'Discord' },
    { value: 'mail', label: 'Email' },
    { value: 'phone', label: 'Telefon' }
  ];

  const cursorOptions = [
    { value: 'default', label: 'Varsayılan' },
    { value: 'pointer', label: 'Pointer' },
    { value: 'crosshair', label: 'Artı İşareti' },
    { value: 'neon-dot', label: 'Neon Nokta' },
    { value: 'custom', label: 'Özel' }
  ];

  return (
    <div className="space-y-6">
      {/* Save/Reset Actions */}
      {hasChanges && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Kaydedilmemiş değişiklikler var
              </span>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Sıfırla
                </Button>
                <Button size="sm" onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Grid - Horizontal Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Basic Profile Settings */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Temel Bilgiler</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Kullanıcı Adı</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => handleFormChange('username', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Biyografi</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleFormChange('bio', e.target.value)}
                placeholder="digital nomad / hacker / dreamer"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Visual Customization */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Görsel Özelleştirme</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Tema</Label>
              <Select 
                value={formData.theme} 
                onValueChange={(value) => handleFormChange('theme', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dark">Koyu</SelectItem>
                  <SelectItem value="light">Açık</SelectItem>
                  <SelectItem value="system">Sistem</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Video className="w-4 h-4" />
                  Arka Plan Video/Fotoğraf
                </Label>
                <Input
                  value={formData.background_video_url}
                  onChange={(e) => handleFormChange('background_video_url', e.target.value)}
                  placeholder="https://example.com/video.mp4 veya .jpg/.png"
                />
                <p className="text-xs text-muted-foreground">
                  Video (.mp4) veya resim (.jpg, .png) URL'si girin. Boş bırakırsanız gradient arka plan kullanılır.
                </p>
                
                {/* Quick action buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('background_video_url', 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=1920')}
                    className="text-xs flex items-center gap-1"
                  >
                    <Image className="w-3 h-3" />
                    Test Resim
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('background_video_url', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4')}
                    className="text-xs flex items-center gap-1"
                  >
                    <Video className="w-3 h-3" />
                    Test Video
                  </Button>
                </div>
                
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => handleFormChange('background_video_url', '')}
                  className="text-xs w-full"
                >
                  Temizle
                </Button>
              </div>

              {/* Audio URL */}
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Music className="w-4 h-4" />
                  Arka Plan Müziği
                </Label>
                <Input
                  value={formData.audio_url}
                  onChange={(e) => handleFormChange('audio_url', e.target.value)}
                  placeholder="https://example.com/music.mp3"
                />
                <p className="text-xs text-muted-foreground">
                  MP3 formatında müzik dosyası URL'si girin. Ziyaretçiler ses açıp kapatabilir.
                </p>
                
                {/* Audio test buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('audio_url', 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav')}
                    className="text-xs flex items-center gap-1"
                  >
                    <Music className="w-3 h-3" />
                    Test Müzik
                  </Button>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleFormChange('audio_url', '')}
                    className="text-xs"
                  >
                    Temizle
                  </Button>
                </div>
              </div>

              {/* Color Customizer Integration */}
              <ColorCustomizer 
                onColorChange={handleFormChange}
                currentColors={{
                  primary_color: formData.primary_color,
                  accent_color: formData.accent_color,
                  theme: formData.theme
                }}
              />
            </div>
            
          </CardContent>
        </Card>

        {/* Cursor Customization */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Cursor Özelleştirme</CardTitle>
            <CardDescription>
              Profilinizde görünen mouse cursor'ı özelleştirin.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Cursor Stili</Label>
              <Select 
                value={formData.cursor_style} 
                onValueChange={(value) => handleFormChange('cursor_style', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {cursorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.cursor_style === 'custom' && (
              <div className="space-y-2">
                <Label htmlFor="custom-cursor">Özel Cursor URL</Label>
                <Input
                  id="custom-cursor"
                  value={formData.custom_cursor_url}
                  onChange={(e) => handleFormChange('custom_cursor_url', e.target.value)}
                  placeholder="https://example.com/cursor.png"
                />
                <p className="text-xs text-muted-foreground">
                  PNG/GIF formatında cursor dosyası URL'si girin. Önerilen boyut: 32x32px
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Social Links - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle>Bağlantılar & Custom URL</CardTitle>
          <CardDescription>
            Sosyal medya linklerinizi, web sitenizi veya özel URL'lerinizi ekleyin.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Quick Add Templates */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-muted/50 rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewLink({ name: 'Website', url: 'https://', icon: 'globe', color: '#ffffff' })}
              className="text-sm"
            >
              + Website
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewLink({ name: 'Portfolio', url: 'https://', icon: 'globe', color: '#ffffff' })}
              className="text-sm"
            >
              + Portfolio
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setNewLink({ name: 'Custom Link', url: 'https://', icon: 'link', color: '#ffffff' })}
              className="text-sm"
            >
              + Custom URL
            </Button>
          </div>

          {/* Add new link */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            <Input
              placeholder="Platform/Site adı"
              value={newLink.name}
              onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
            />
            <Input
              placeholder="https://example.com"
              value={newLink.url}
              onChange={(e) => setNewLink({ ...newLink, url: e.target.value })}
            />
            <Select 
              value={newLink.icon} 
              onValueChange={(value) => setNewLink({ ...newLink, icon: value })}
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
            <Button onClick={handleAddLink} size="sm" disabled={!newLink.name || !newLink.url}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Existing links */}
          <div className="space-y-2">
            {socialLinks.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground text-sm">
                Henüz bağlantı eklenmemiş. Yukarıdaki formla website, sosyal medya veya özel URL'lerinizi ekleyebilirsiniz.
              </div>
            ) : (
              socialLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2 p-2 border rounded">
                  <span className="font-medium">{link.name}</span>
                  <span className="text-sm text-muted-foreground flex-1 truncate">{link.url}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => updateSocialLink(link.id, { is_visible: !link.is_visible })}
                    title={link.is_visible ? 'Gizle' : 'Göster'}
                  >
                    {link.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSocialLink(link.id)}
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Final Save Button */}
      {hasChanges && (
        <div className="flex justify-end pt-4 border-t">
          <Button onClick={handleSave} disabled={isSaving} size="lg">
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProfileSettings;
