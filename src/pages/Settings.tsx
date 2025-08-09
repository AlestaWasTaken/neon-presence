import { useState, useRef } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { supabase } from '@/integrations/supabase/client';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import ColorCustomizer from '@/components/ColorCustomizer';
import { SocialLinksManager } from '@/components/SocialLinksManager';
import { VideoTestButton } from '@/components/VideoTestButton';
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
  const [hasChanges, setHasChanges] = useState(false);
  const [tempProfile, setTempProfile] = useState<any>({});
  
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading video with fileName:', fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

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
      console.error('Video upload error:', error);
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading avatar with fileName:', fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Avatar upload error:', uploadError);
        throw uploadError;
      }

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
      console.error('Avatar upload error:', error);
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
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      console.log('Uploading audio with fileName:', fileName);
      
      const { error: uploadError } = await supabase.storage
        .from('audio')
        .upload(fileName, file);

      if (uploadError) {
        console.error('Audio upload error:', uploadError);
        throw uploadError;
      }

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
      console.error('Audio upload error:', error);
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message
      });
    } finally {
      setUploading(false);
    }
  };

  // Handle profile changes tracking
  const handleProfileChange = (field: string, value: any) => {
    setTempProfile({ ...tempProfile, [field]: value });
    setHasChanges(true);
  };

  const saveChanges = async () => {
    if (!hasChanges || Object.keys(tempProfile).length === 0) return;
    
    try {
      await updateProfile(tempProfile);
      setTempProfile({});
      setHasChanges(false);
      
      toast({
        title: "Changes saved successfully",
        description: "Your profile has been updated.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive", 
        title: "Failed to save changes",
        description: error.message
      });
    }
  };

  const resetChanges = () => {
    setTempProfile({});
    setHasChanges(false);
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
      <OptimizedVideoBackground 
        key={`${profile?.background_video_url}-${Date.now()}`} 
        profileUserId={user.id} 
      />
      <CursorStyle profileUserId={user.id} />
      
      {/* Sidebar */}
      <div className="w-64 glass border-r border-smoke-700/30 relative z-20 animate-slide-in-right backdrop-blur-sm bg-white/5 border border-white/10">
        {/* Header */}
        <div className="p-6 border-b border-smoke-700/30">
          <Link to="/" className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-smoke-300 hover:text-smoke-100 transition-transform duration-200 hover:scale-105">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-lg font-bold text-smoke-100 animate-fade-in">Dashboard</h1>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarItems.map((item, index) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all transition-transform duration-200 hover:scale-105 animate-fade-in ${
                activeTab === item.id 
                  ? 'bg-smoke-800/50 text-smoke-100 border border-smoke-600/30 shadow-lg shadow-primary/20' 
                  : 'text-smoke-400 hover:text-smoke-200 hover:bg-smoke-800/30'
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <item.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10 overflow-y-auto">
        {/* Header with Save Changes */}
        <div className="border-b border-smoke-700/30 backdrop-blur-sm bg-white/5 border border-white/10">
          <div className="px-8 py-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-smoke-100 animate-fade-in">Assets Uploader</h2>
              <div className="flex items-center gap-4">
                {hasChanges && (
                  <div className="flex items-center gap-2 animate-scale-in">
                    <Button 
                      onClick={resetChanges}
                      variant="ghost" 
                      size="sm" 
                      className="text-smoke-400 hover:text-smoke-200"
                    >
                      Reset
                    </Button>
                    <Button 
                      onClick={saveChanges}
                      size="sm" 
                      className="bg-gradient-to-r from-primary/20 to-accent/20 text-primary border border-primary/30 hover:bg-primary/10 shadow-lg shadow-primary/20 animate-pulse"
                    >
                      Save Changes
                    </Button>
                  </div>
                )}
                <Button variant="ghost" size="sm" className="text-smoke-300 hover:text-smoke-100 transition-transform duration-200 hover:scale-105">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">
          {activeTab === 'customize' && (
            <div className="space-y-8">
              {/* Assets Uploader Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
                {/* Background Video */}
                <Card className="backdrop-blur-sm bg-white/5 border border-white/10 border-smoke-700/30 transition-transform duration-200 hover:scale-105 transition-shadow duration-300 hover:shadow-lg hover:shadow-primary/20 group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Video className="w-4 h-4 text-primary animate-pulse" />
                      Background
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {profile?.background_video_url ? (
                      <div className="aspect-video bg-smoke-800/50 rounded-lg overflow-hidden relative group/video">
                        <video 
                          key={profile.background_video_url}
                          src={profile.background_video_url}
                          className="w-full h-full object-cover animate-scale-in"
                          muted
                          loop
                          autoPlay
                          playsInline
                        />
                        <button
                          onClick={() => {
                            updateProfile({ background_video_url: null });
                            setHasChanges(false);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover/video:opacity-100 transition-all"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => videoFileRef.current?.click()}
                        className="aspect-video bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-all hover:bg-primary/5 group/upload"
                      >
                        <Upload className="w-6 h-6 text-smoke-400 mb-2 group-hover/upload:text-primary transition-colors animate-pulse" />
                        <span className="text-xs text-smoke-400 group-hover/upload:text-smoke-200 transition-colors">Click to upload</span>
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
                    <div className="flex gap-2">
                      <Button
                        onClick={() => videoFileRef.current?.click()}
                        disabled={uploading}
                        size="sm"
                        className="flex-1 hover-glow relative overflow-hidden group/btn"
                        variant="outline"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 opacity-0 group-hover/btn:opacity-100 transition-all"></div>
                        <span className="relative z-10">
                          {uploading ? 'Uploading...' : 'Upload Video'}
                        </span>
                      </Button>
                      <VideoTestButton videoUrl={profile?.background_video_url} />
                    </div>
                  </CardContent>
                </Card>

                {/* Audio */}
                <Card className="glass border-smoke-700/30 hover-scale hover-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-primary/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Music className="w-4 h-4 text-accent animate-glow-pulse" />
                      Audio
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {profile?.audio_url ? (
                      <div className="space-y-3">
                        <div className="p-4 bg-smoke-800/30 rounded-lg group/audio">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-smoke-300 flex items-center gap-2">
                              <Volume2 className="w-3 h-3 text-accent" />
                              Background Music
                            </span>
                            <button
                              onClick={() => {
                                updateProfile({ audio_url: null });
                                setHasChanges(false);
                              }}
                              className="text-red-400 hover:text-red-300 hover-scale"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                        <Button
                          onClick={toggleAudio}
                          size="sm"
                          variant="outline"
                          className="w-full hover-glow relative overflow-hidden group/play"
                        >
                          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover/play:opacity-100 transition-all"></div>
                          <span className="relative z-10 flex items-center gap-2">
                            {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                            {isPlaying ? 'Pause' : 'Play'}
                          </span>
                        </Button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => audioFileRef.current?.click()}
                        className="aspect-video bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent/50 transition-all hover:bg-accent/5 group/upload"
                      >
                        <Music className="w-6 h-6 text-smoke-400 mb-2 group-hover/upload:text-accent transition-colors animate-pulse" />
                        <span className="text-xs text-smoke-400 group-hover/upload:text-smoke-200 transition-colors">Click to upload</span>
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
                        className="w-full hover-glow relative overflow-hidden group/btn"
                        variant="outline"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 to-primary/10 opacity-0 group-hover/btn:opacity-100 transition-all"></div>
                        <span className="relative z-10">
                          {uploading ? 'Uploading...' : 'Upload Audio'}
                        </span>
                      </Button>
                    )}
                  </CardContent>
                </Card>

                {/* Profile Avatar */}
                <Card className="glass border-smoke-700/30 hover-scale hover-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-smoke-600/5 to-smoke-400/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <User className="w-4 h-4 text-smoke-300 animate-glow-pulse" />
                      Profile Avatar
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 relative z-10">
                    {profile?.avatar_url ? (
                      <div className="aspect-square bg-smoke-800/50 rounded-lg overflow-hidden relative group/avatar">
                        <img 
                          src={profile.avatar_url}
                          alt="Avatar"
                          className="w-full h-full object-cover animate-scale-in hover-scale"
                        />
                        <button
                          onClick={() => {
                            updateProfile({ avatar_url: null });
                            setHasChanges(false);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500/80 text-white rounded-full opacity-0 group-hover/avatar:opacity-100 transition-all hover-scale"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        onClick={() => avatarFileRef.current?.click()}
                        className="aspect-square bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-smoke-400/50 transition-all hover:bg-smoke-400/5 group/upload"
                      >
                        <User className="w-6 h-6 text-smoke-400 mb-2 group-hover/upload:text-smoke-200 transition-colors animate-pulse" />
                        <span className="text-xs text-smoke-400 group-hover/upload:text-smoke-200 transition-colors">Click to upload</span>
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
                      className="w-full hover-glow relative overflow-hidden group/btn"
                      variant="outline"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-smoke-400/10 to-smoke-300/10 opacity-0 group-hover/btn:opacity-100 transition-all"></div>
                      <span className="relative z-10">
                        {uploading ? 'Uploading...' : 'Upload Avatar'}
                      </span>
                    </Button>
                  </CardContent>
                </Card>

                {/* Custom Cursor */}
                <Card className="glass border-smoke-700/30 hover-scale hover-glow group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-smoke-500/5 to-smoke-600/5 opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
                  <CardHeader className="pb-3 relative z-10">
                    <CardTitle className="text-sm text-smoke-200 flex items-center gap-2">
                      <Mouse className="w-4 h-4 text-smoke-400 animate-glow-pulse" />
                      Custom Cursor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <div className="aspect-square bg-smoke-800/30 border border-dashed border-smoke-600/50 rounded-lg flex flex-col items-center justify-center group/cursor">
                      <Mouse className="w-6 h-6 text-smoke-400 mb-2 group-hover/cursor:text-smoke-300 transition-colors" />
                      <span className="text-xs text-smoke-400 group-hover/cursor:text-smoke-200 transition-colors">Coming Soon</span>
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
                        placeholder="Enter your bio..."
                        className="bg-smoke-800/30 border-smoke-600/30 text-smoke-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        rows={3}
                        value={tempProfile.bio !== undefined ? tempProfile.bio : (profile?.bio || '')}
                        onChange={(e) => handleProfileChange('bio', e.target.value)}
                      />
                    </div>

                    {/* Username */}
                    <div className="space-y-2">
                      <Label className="text-smoke-200">Username</Label>
                      <Input 
                        placeholder="Enter username..."
                        className="bg-smoke-800/30 border-smoke-600/30 text-smoke-200 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all"
                        value={tempProfile.username !== undefined ? tempProfile.username : (profile?.username || '')}
                        onChange={(e) => handleProfileChange('username', e.target.value)}
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
              <ColorCustomizer 
                onColorChange={handleProfileChange}
                currentColors={{
                  primary_color: tempProfile.primary_color || profile?.primary_color,
                  accent_color: tempProfile.accent_color || profile?.accent_color,
                  theme: tempProfile.theme || profile?.theme
                }}
              />

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

          {activeTab === 'links' && (
            <div className="space-y-8">
              <Card className="backdrop-blur-sm bg-white/5 border border-white/10">
                <CardContent className="p-6">
                  <SocialLinksManager />
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
