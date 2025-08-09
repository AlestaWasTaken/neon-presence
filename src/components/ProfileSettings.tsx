import { useState } from 'react';
import { useProfile } from '@/hooks/useProfile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Plus, Trash2, Eye, EyeOff } from 'lucide-react';

const ProfileSettings = () => {
  const { profile, socialLinks, updateProfile, addSocialLink, updateSocialLink, deleteSocialLink } = useProfile();
  const [isOpen, setIsOpen] = useState(false);
  const [newLink, setNewLink] = useState({
    name: '',
    url: '',
    icon: 'globe',
    color: '#ffffff'
  });

  if (!profile) return null;

  const handleProfileUpdate = (field: string, value: string) => {
    updateProfile({ [field]: value });
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
    { value: 'globe', label: 'Website' },
    { value: 'github', label: 'GitHub' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'instagram', label: 'Instagram' },
    { value: 'linkedin', label: 'LinkedIn' },
    { value: 'youtube', label: 'YouTube' },
    { value: 'mail', label: 'Email' },
    { value: 'discord', label: 'Discord' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profil Ayarları</DialogTitle>
          <DialogDescription>
            Profilinizi özelleştirin ve sosyal medya linklerinizi yönetin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
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
                  value={profile.username}
                  onChange={(e) => handleProfileUpdate('username', e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="bio">Biyografi</Label>
                <Textarea
                  id="bio"
                  value={profile.bio || ''}
                  onChange={(e) => handleProfileUpdate('bio', e.target.value)}
                  placeholder="digital nomad / hacker / dreamer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Theme Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Tema ve Renkler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select 
                  value={profile.theme} 
                  onValueChange={(value) => handleProfileUpdate('theme', value)}
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
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Ana Renk</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary-color"
                      type="color"
                      value={profile.primary_color}
                      onChange={(e) => handleProfileUpdate('primary_color', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={profile.primary_color}
                      onChange={(e) => handleProfileUpdate('primary_color', e.target.value)}
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
                      value={profile.accent_color}
                      onChange={(e) => handleProfileUpdate('accent_color', e.target.value)}
                      className="w-12 h-10"
                    />
                    <Input
                      value={profile.accent_color}
                      onChange={(e) => handleProfileUpdate('accent_color', e.target.value)}
                      placeholder="#ff0080"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Linkleri</CardTitle>
              <CardDescription>
                Profilinizde görünecek sosyal medya linklerinizi yönetin.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add new link */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                <Input
                  placeholder="Platform adı"
                  value={newLink.name}
                  onChange={(e) => setNewLink({ ...newLink, name: e.target.value })}
                />
                <Input
                  placeholder="URL"
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
                <Button onClick={handleAddLink} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {/* Existing links */}
              <div className="space-y-2">
                {socialLinks.map((link) => (
                  <div key={link.id} className="flex items-center gap-2 p-2 border rounded">
                    <span className="font-medium">{link.name}</span>
                    <span className="text-sm text-muted-foreground flex-1">{link.url}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => updateSocialLink(link.id, { is_visible: !link.is_visible })}
                    >
                      {link.is_visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteSocialLink(link.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettings;
