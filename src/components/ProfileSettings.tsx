import { useState, useEffect } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, Eye, EyeOff, Save, RotateCcw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ProfileSettings = () => {
  const { profile, socialLinks, updateProfile, addSocialLink, updateSocialLink, deleteSocialLink } = useProfile();
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    primary_color: '#00ff9f',
    accent_color: '#ff0080',
    theme: 'neon' as 'neon' | 'minimal' | 'cyberpunk',
    background_video_url: '',
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
        primary_color: profile.primary_color || '#00ff9f',
        accent_color: profile.accent_color || '#ff0080',
        theme: profile.theme || 'neon',
        background_video_url: profile.background_video_url || '',
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
        primary_color: profile.primary_color || '#00ff9f',
        accent_color: profile.accent_color || '#ff0080',
        theme: profile.theme || 'neon',
        background_video_url: profile.background_video_url || '',
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

          {/* Basic Profile Settings */}
          <Card>
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
                />
              </div>
            </CardContent>
          </Card>

          {/* Visual Customization */}
          <Card>
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
                    <SelectItem value="neon">Neon</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="cyberpunk">Cyberpunk</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background-video">Arka Plan Video URL</Label>
                <Input
                  id="background-video"
                  value={formData.background_video_url}
                  onChange={(e) => handleFormChange('background_video_url', e.target.value)}
                  placeholder="https://example.com/video.mp4"
                />
                <p className="text-xs text-muted-foreground">
                  MP4 formatında video URL'si girin. Boş bırakırsanız gradient arka plan kullanılır.
                </p>
                <div className="flex gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('background_video_url', 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4')}
                  >
                    Test Video 1
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('background_video_url', 'https://www.learningcontainer.com/wp-content/uploads/2020/05/sample-mp4-file.mp4')}
                  >
                    Test Video 2
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleFormChange('background_video_url', '')}
                  >
                    Temizle
                  </Button>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Ana Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={formData.primary_color}
                      onChange={(e) => handleFormChange('primary_color', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={formData.primary_color}
                      onChange={(e) => handleFormChange('primary_color', e.target.value)}
                      placeholder="#00ff9f"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="accent-color">Vurgu Rengi</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accent-color"
                      type="color"
                      value={formData.accent_color}
                      onChange={(e) => handleFormChange('accent_color', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={formData.accent_color}
                      onChange={(e) => handleFormChange('accent_color', e.target.value)}
                      placeholder="#ff0080"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cursor Customization */}
          <Card>
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

          {/* Social Links */}
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
