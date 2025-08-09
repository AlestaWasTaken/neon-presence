import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  ArrowLeft, 
  Upload, 
  User, 
  Video, 
  Music, 
  Mouse, 
  Palette,
  Settings as SettingsIcon,
  Link as LinkIcon,
  Crown,
  ImageIcon,
  X,
  Play,
  Pause,
  Volume2,
  Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('customize');
  const [uploading, setUploading] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [audioUrl, setAudioUrl] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  
  const videoFileRef = useRef<HTMLInputElement>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const audioFileRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-smoke-950 flex items-center justify-center">
        <OptimizedVideoBackground />
        <div className="relative z-10 text-smoke-300 animate-pulse text-sm font-light tracking-wider">
          loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleVideoUpload = async (file: File) => {
    if (!user || !file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(fileName);

      await updateProfile({ background_video_url: data.publicUrl });
      setVideoUrl(data.publicUrl);
      
      toast({
        title: "Video uploaded successfully",
        description: "Background video has been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!user || !file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      await updateProfile({ avatar_url: data.publicUrl });
      setAvatarUrl(data.publicUrl);
      
      toast({
        title: "Avatar uploaded successfully",
        description: "Profile avatar has been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const handleAudioUpload = async (file: File) => {
    if (!user || !file) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('audio')
        .getPublicUrl(fileName);

      await updateProfile({ audio_url: data.publicUrl });
      setAudioUrl(data.publicUrl);
      
      toast({
        title: "Audio uploaded successfully",
        description: "Background audio has been updated."
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const sidebarItems = [
    { id: 'account', icon: User, label: 'Account' },
    { id: 'customize', icon: SettingsIcon, label: 'Customize' },
    { id: 'links', icon: LinkIcon, label: 'Links' },
    { id: 'premium', icon: Crown, label: 'Premium' },
    { id: 'templates', icon: ImageIcon, label: 'Templates' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950 flex">
      <OptimizedVideoBackground profileUserId={user.id} />
      <CursorStyle profileUserId={user.id} />
      
      {/* Sidebar */}
      <div className="w-64 glass border-r border-smoke-700/30 relative z-20">
        {/* Header */}
        <div className="p-6 border-b border-smoke-700/30">
          <Link to="/" className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-smoke-300 hover:text-smoke-100">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-smoke-100">Dashboard</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                activeTab === item.id 
                  ? 'bg-smoke-800/50 text-smoke-100 border border-smoke-600/30' 
                  : 'text-smoke-400 hover:text-smoke-200 hover:bg-smoke-800/30'
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-y-auto">
        {/* Header */}
        <div className="border-b border-smoke-700/30 glass">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-smoke-100">Assets Uploader</h2>
              <Link to={`/${profile?.username || user.id}`}>
                <Button variant="ghost" size="sm" className="text-smoke-300 hover:text-smoke-100">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'customize' && (
            <div className="space-y-8">
              {/* Assets Uploader Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Background Video */}
                <Card className="glass border-smoke-700/30 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Video className="w-4 h-4" />
                      Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.background_video_url ? (
                      <div className="aspect-video bg-smoke-800/50 rounded-lg overflow-hidden relative group">
                        <video 
                          src={profile.background_video_url}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          autoPlay
                        />
                        <button
                          onClick={() => updateProfile({ background_video_url: null })}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => videoFileRef.current?.click()}
                        className="aspect-video bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-smoke-500/50 transition-colors"
                      >
                        <Upload className="w-6 h-6 text-smoke-400 mb-2" />
                        <span className="text-xs text-smoke-400">Click to upload</span>
                      </div>
                    )}
                    <input
                      ref={videoFileRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleVideoUpload(file);
                      }}
                    />
                    <Button
                      onClick={() => videoFileRef.current?.click()}
                      disabled={uploading}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      {uploading ? 'Uploading...' : 'Upload Video'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Audio */}
                <Card className="glass border-smoke-700/30 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Music className="w-4 h-4" />
                      Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.audio_url ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-smoke-800/30 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-smoke-300">Background Music</span>
                            <button
                              onClick={() => updateProfile({ audio_url: null })}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <Button
                          onClick={toggleAudio}
                          size="sm"
                          variant="outline"
                          className="w-full"
                        >
                          {isPlaying ? <Pause className="w-3 h-3 mr-2" /> : <Play className="w-3 h-3 mr-2" />}
                          {isPlaying ? 'Pause' : 'Play'}
                        </Button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => audioFileRef.current?.click()}
                        className="aspect-video bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-smoke-500/50 transition-colors"
                      >
                        <Music className="w-6 h-6 text-smoke-400 mb-2" />
                        <span className="text-xs text-smoke-400">Click to upload</span>
                      </div>
                    )}
                    <input
                      ref={audioFileRef}
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAudioUpload(file);
                      }}
                    />
                    {!profile?.audio_url && (
                      <Button
                        onClick={() => audioFileRef.current?.click()}
                        disabled={uploading}
                        size="sm"
                        className="w-full"
                        variant="outline"
                      >
                        {uploading ? 'Uploading...' : 'Upload Audio'}
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Avatar */}
                <Card className="glass border-smoke-700/30 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Profile Avatar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {profile?.avatar_url ? (
                      <div className="aspect-square bg-smoke-800/50 rounded-lg overflow-hidden relative group">
                        <img 
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => updateProfile({ avatar_url: null })}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => avatarFileRef.current?.click()}
                        className="aspect-square bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-smoke-500/50 transition-colors"
                      >
                        <User className="w-6 h-6 text-smoke-400 mb-2" />
                        <span className="text-xs text-smoke-400">Click to upload</span>
                      </div>
                    )}
                    <input
                      ref={avatarFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleAvatarUpload(file);
                      }}
                    />
                    <Button
                      onClick={() => avatarFileRef.current?.click()}
                      disabled={uploading}
                      size="sm"
                      className="w-full"
                      variant="outline"
                    >
                      {uploading ? 'Uploading...' : 'Upload Avatar'}
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Cursor */}
                <Card className="glass border-smoke-700/30 hover-lift">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Mouse className="w-4 h-4" />
                      Custom Cursor
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="aspect-square bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center">
                      <Mouse className="w-6 h-6 text-smoke-400 mb-2" />
                      <span className="text-xs text-smoke-400">Coming Soon</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator className="border-smoke-700/30" />

              {/* General Customization */}
              <Card className="glass border-smoke-700/30">
                <CardHeader>
                  <CardTitle className="text-smoke-100">General Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Description */}
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Description</Label>
                      <Textarea 
                        placeholder={profile?.bio || "Enter your bio..."}
                        className="bg-smoke-800/30 border-smoke-600/30 text-smoke-200"
                        rows={3}
                        value={profile?.bio || ''}
                        onChange={(e) => updateProfile({ bio: e.target.value })}
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Username</Label>
                      <Input 
                        placeholder="Enter username..."
                        className="bg-smoke-800/30 border-smoke-600/30 text-smoke-200"
                        value={profile?.username || ''}
                        onChange={(e) => updateProfile({ username: e.target.value })}
                      />
                    </div>

                    {/* Profile Opacity */}
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Profile Opacity</Label>
                      <Slider
                        defaultValue={[80]}
                        max={100}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Color Customization */}
              <Card className="glass border-smoke-700/30">
                <CardHeader>
                  <CardTitle className="text-smoke-100">Color Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Primary Color</Label>
                      <Input 
                        type="color"
                        value={profile?.primary_color || '#00ff9f'}
                        onChange={(e) => updateProfile({ primary_color: e.target.value })}
                        className="h-10 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Accent Color</Label>
                      <Input 
                        type="color"
                        value={profile?.accent_color || '#ff0080'}
                        onChange={(e) => updateProfile({ accent_color: e.target.value })}
                        className="h-10 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Text Color</Label>
                      <Input 
                        type="color"
                        defaultValue="#ffffff"
                        className="h-10 w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Background Color</Label>
                      <Input 
                        type="color"
                        defaultValue="#000000"
                        className="h-10 w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Other Customization */}
              <Card className="glass border-smoke-700/30">
                <CardHeader>
                  <CardTitle className="text-smoke-100">Other Customization</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="flex items-center justify-between">
                      <Label className="text-smoke-200">Volume Control</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-smoke-200">Animated Title</Label>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-smoke-200">Glow Effects</Label>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'account' && (
            <Card className="glass border-smoke-700/30 max-w-2xl">
              <CardHeader>
                <CardTitle className="text-smoke-100">Account Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-smoke-200">Email</Label>
                  <Input 
                    value={user?.email || ''}
                    disabled
                    className="bg-smoke-800/30 border-smoke-600/30 text-smoke-400"
                  />
                </div>
                <div>
                  <Label className="text-smoke-200">User ID</Label>
                  <Input 
                    value={user?.id || ''}
                    disabled
                    className="bg-smoke-800/30 border-smoke-600/30 text-smoke-400 font-mono text-xs"
                  />
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Audio Player (hidden) */}
      {profile?.audio_url && (
        <audio
          ref={audioRef}
          src={profile.audio_url}
          loop
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />
      )}
    </div>
  );
}
