import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate, useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import AudioBackground from '@/components/AudioBackground';
import ProfileSettings from '@/components/ProfileSettings';
import FileUploadCard from '@/components/FileUploadCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useFileUpload } from '@/hooks/useFileUpload';
import { useToast } from '@/hooks/use-toast';

export default function NewSettings() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, updateProfile } = useProfile();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';
  const { toast } = useToast();

  // File upload hooks
  const backgroundUpload = useFileUpload({ 
    bucket: 'backgrounds', 
    allowedTypes: ['video/mp4', 'video/webm'], 
    maxSize: 100 
  });
  
  const audioUpload = useFileUpload({ 
    bucket: 'audio', 
    allowedTypes: ['audio/mp3', 'audio/wav', 'audio/ogg'], 
    maxSize: 50 
  });
  
  const avatarUpload = useFileUpload({ 
    bucket: 'avatars', 
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'], 
    maxSize: 5 
  });
  
  const cursorUpload = useFileUpload({ 
    bucket: 'cursors', 
    allowedTypes: ['image/png', 'image/webp'], 
    maxSize: 2 
  });

  const handleFileUpload = async (file: File, type: 'background' | 'audio' | 'avatar' | 'cursor') => {
    let url: string | null = null;
    
    switch (type) {
      case 'background':
        url = await backgroundUpload.uploadFile(file);
        if (url && profile) {
          await updateProfile({ background_video_url: url });
        }
        break;
      case 'audio':
        url = await audioUpload.uploadFile(file);
        if (url && profile) {
          // Temporarily save to custom_cursor_url until types are updated
          await updateProfile({ custom_cursor_url: url });
        }
        break;
      case 'avatar':
        url = await avatarUpload.uploadFile(file);
        if (url && profile) {
          // Temporarily save to theme field until types are updated  
          await updateProfile({ theme: url as any });
        }
        break;
      case 'cursor':
        url = await cursorUpload.uploadFile(file);
        if (url && profile) {
          await updateProfile({ custom_cursor_url: url });
        }
        break;
    }

    if (url) {
      toast({
        title: "Upload successful",
        description: `${type} uploaded successfully`
      });
    }
  };

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950 relative">
      <OptimizedVideoBackground profileUserId={user.id} />
      <AudioBackground profileUserId={user.id} />
      <CursorStyle profileUserId={user.id} />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full relative z-10">
          <AppSidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col relative z-10">
            {/* Header with Sidebar Toggle */}
            <header className="h-16 flex items-center justify-between border-b border-smoke-700/50 glass px-6 sticky top-0 z-30 backdrop-blur-sm bg-background/80">
              <div className="flex items-center gap-4">
                <SidebarTrigger className="text-smoke-300 hover:text-smoke-100" />
                <h1 className="text-xl font-black text-smoke-100">Assets Uploader</h1>
              </div>
              
              {profile && (
                <div className="flex items-center gap-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="text-smoke-300 hover:text-smoke-100 transition-colors cursor-default">
                          {profile.username}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>User ID: #{profile.sequential_id}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </header>

            {/* Content Area */}
            <main className="flex-1 p-6 relative z-10 overflow-y-auto">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'account' && (
                  <>
                    {/* Top Section - Background, Audio, Profile Avatar, Custom Cursor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                      <FileUploadCard
                        title="Background"
                        currentFile={profile?.background_video_url}
                        acceptedTypes="video/*"
                        placeholder="Upload video background"
                        uploading={backgroundUpload.uploading}
                        onFileSelect={(file) => handleFileUpload(file, 'background')}
                        onDelete={profile?.background_video_url ? () => updateProfile({ background_video_url: '' }) : undefined}
                        type="video"
                      />

                      <FileUploadCard
                        title="Audio"
                        currentFile={profile?.custom_cursor_url?.includes('audio') ? profile.custom_cursor_url : undefined}
                        acceptedTypes="audio/*"
                        placeholder="Upload background music"
                        uploading={audioUpload.uploading}
                        onFileSelect={(file) => handleFileUpload(file, 'audio')}
                        type="audio"
                      />

                      <FileUploadCard
                        title="Profile Avatar"
                        currentFile={typeof profile?.theme === 'string' && profile.theme.startsWith('http') ? profile.theme : undefined}
                        acceptedTypes="image/*"
                        placeholder="Upload profile picture"
                        uploading={avatarUpload.uploading}
                        onFileSelect={(file) => handleFileUpload(file, 'avatar')}
                        type="image"
                      />

                      <FileUploadCard
                        title="Custom Cursor"
                        currentFile={profile?.custom_cursor_url && !profile.custom_cursor_url.includes('audio') ? profile.custom_cursor_url : undefined}
                        acceptedTypes="image/png,image/webp"
                        placeholder="Upload cursor image"
                        uploading={cursorUpload.uploading}
                        onFileSelect={(file) => handleFileUpload(file, 'cursor')}
                        onDelete={profile?.custom_cursor_url ? () => updateProfile({ custom_cursor_url: '' }) : undefined}
                        type="image"
                      />
                    </div>

                    {/* Quick Test Video Button */}
                    {!profile?.background_video_url && (
                      <div className="bg-blue-900/30 border border-blue-700/50 rounded-lg p-4 mb-8 text-center">
                        <p className="text-blue-200 text-sm mb-2">Test video background:</p>
                        <button
                          onClick={() => updateProfile({ background_video_url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4' })}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Add Test Video
                        </button>
                      </div>
                    )}

                    {/* Want exclusive features banner */}
                    <div className="bg-gradient-to-r from-purple-900/50 to-pink-900/50 border border-purple-700/50 rounded-lg p-4 mb-8 text-center">
                      <span className="text-purple-200 text-sm">Want exclusive features? Unlock more with ❤️ Premium</span>
                    </div>

                    {/* Profile Settings */}
                    <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                      <ProfileSettings />
                    </div>
                  </>
                )}

                {activeTab === 'customize' && (
                  <div className="space-y-6">
                    {/* Theme Settings */}
                    <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-smoke-100 mb-4">Theme Settings</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-smoke-200 mb-2">Primary Color</label>
                          <div className="flex gap-2">
                            <input type="color" className="w-12 h-10 rounded border-2 border-smoke-600" defaultValue="#8b5cf6" />
                            <input type="text" className="flex-1 bg-smoke-800 border border-smoke-600 rounded px-3 py-2 text-smoke-100" placeholder="#8b5cf6" />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-smoke-200 mb-2">Background Style</label>
                          <select className="w-full bg-smoke-800 border border-smoke-600 rounded px-3 py-2 text-smoke-100">
                            <option>Gradient</option>
                            <option>Solid Color</option>
                            <option>Video</option>
                            <option>Image</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Layout Customization */}
                    <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-smoke-100 mb-4">Layout Options</h2>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center">
                          <div className="bg-smoke-800 border border-smoke-600 rounded-lg p-4 mb-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-smoke-700 rounded mb-2"></div>
                            <div className="text-xs text-smoke-300">Centered</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-smoke-800 border border-smoke-600 rounded-lg p-4 mb-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-smoke-700 rounded mb-2 flex">
                              <div className="w-1/3 bg-smoke-600 mr-2"></div>
                              <div className="flex-1 bg-smoke-600"></div>
                            </div>
                            <div className="text-xs text-smoke-300">Split</div>
                          </div>
                        </div>
                        <div className="text-center">
                          <div className="bg-smoke-800 border border-smoke-600 rounded-lg p-4 mb-2 cursor-pointer hover:border-primary">
                            <div className="w-full h-20 bg-smoke-700 rounded mb-2 grid grid-cols-2 gap-1">
                              <div className="bg-smoke-600"></div>
                              <div className="bg-smoke-600"></div>
                              <div className="bg-smoke-600"></div>
                              <div className="bg-smoke-600"></div>
                            </div>
                            <div className="text-xs text-smoke-300">Grid</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Font & Typography */}
                    <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                      <h2 className="text-xl font-bold text-smoke-100 mb-4">Typography</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-smoke-200 mb-2">Font Family</label>
                          <select className="w-full bg-smoke-800 border border-smoke-600 rounded px-3 py-2 text-smoke-100">
                            <option>Inter</option>
                            <option>Roboto</option>
                            <option>Poppins</option>
                            <option>Montserrat</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-smoke-200 mb-2">Text Size</label>
                          <input type="range" min="12" max="24" className="w-full" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'links' && (
                  <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-smoke-100 mb-6">Social Links</h2>
                    <p className="text-smoke-400">Manage your social links here.</p>
                  </div>
                )}
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
}