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
import VideoBackground from '@/components/VideoBackground';
import ViewStats from '@/components/ViewStats';
import { 
  Settings, 
  User, 
  Link as LinkIcon, 
  Eye, 
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  Globe,
  Github,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  Mail,
  Phone
} from 'lucide-react';

export default function DashboardPage() {
  const { user, signOut, loading: authLoading } = useAuth();
  const { profile, socialLinks, loading: profileLoading, updateProfile, addSocialLink, deleteSocialLink } = useProfile();
  
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    background_video_url: '',
    audio_url: '',
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
      });
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
      await updateProfile(formData);
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
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-black text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-smoke-400 text-sm mt-1">
                Profilini yönet ve analitiklerini görüntüle
              </p>
            </div>
            <Button asChild variant="ghost" size="sm" className="glass border-smoke-700/30">
              <Link to="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Ana Sayfa
              </Link>
            </Button>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 glass border-smoke-700/30">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Profil
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

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-6">
              <Card className="glass border-smoke-700/30">
                <CardHeader>
                  <CardTitle className="text-smoke-100">Profil Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="username">Kullanıcı Adı</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                        placeholder="kullaniciadi"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bio">Biyografi</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                        placeholder="Kendini tanıt..."
                        rows={3}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="background_video_url">Arka Plan Video/Resim URL</Label>
                      <Input
                        id="background_video_url"
                        value={formData.background_video_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, background_video_url: e.target.value }))}
                        placeholder="https://example.com/video.mp4"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="audio_url">Arka Plan Müzik URL</Label>
                      <Input
                        id="audio_url"
                        value={formData.audio_url}
                        onChange={(e) => setFormData(prev => ({ ...prev, audio_url: e.target.value }))}
                        placeholder="https://example.com/music.mp3"
                      />
                    </div>
                  </div>
                  
                  <Button onClick={handleSave} disabled={isSaving} className="w-full">
                    <Save className="h-4 w-4 mr-2" />
                    {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </CardContent>
              </Card>
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
                        <select
                          id="link-icon"
                          value={newLink.icon}
                          onChange={(e) => setNewLink(prev => ({ ...prev, icon: e.target.value }))}
                          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
                        >
                          {iconOptions.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
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
              <ViewStats profileUserId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
