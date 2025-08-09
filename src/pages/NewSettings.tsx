import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import { Navigate, useSearchParams } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from '@/components/AppSidebar';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import CursorStyle from '@/components/CursorStyle';
import ProfileSettings from '@/components/ProfileSettings';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function NewSettings() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'account';

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
    <div className="min-h-screen bg-gradient-to-b from-background to-smoke-950">
      <OptimizedVideoBackground profileUserId={user.id} />
      <CursorStyle profileUserId={user.id} />
      
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col">
            {/* Header with Sidebar Toggle */}
            <header className="h-16 flex items-center justify-between border-b border-smoke-700/50 glass px-6">
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
            <main className="flex-1 p-6">
              <div className="max-w-7xl mx-auto">
                {activeTab === 'account' && (
                  <>
                    {/* Top Section - Background, Audio, Profile Avatar, Custom Cursor */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                      <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-4">
                        <h3 className="text-smoke-100 font-medium mb-3">Background</h3>
                        <div className="aspect-video bg-smoke-800/50 rounded border border-smoke-700/30 flex items-center justify-center">
                          <span className="text-xs text-smoke-400">HAVAYOLU PERSONELİ</span>
                        </div>
                        <div className="mt-3 flex gap-2">
                          <button className="text-xs text-smoke-400 hover:text-smoke-200">MP4</button>
                          <button className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </div>
                      </div>

                      <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-4">
                        <h3 className="text-smoke-100 font-medium mb-3">Audio</h3>
                        <div className="aspect-video bg-smoke-800/50 rounded border border-smoke-700/30 flex items-center justify-center">
                          <div className="text-smoke-400 text-center">
                            <div className="w-8 h-8 mx-auto mb-2 opacity-50">📁</div>
                            <span className="text-xs">Click to upload/change</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-4">
                        <h3 className="text-smoke-100 font-medium mb-3">Profile Avatar</h3>
                        <div className="aspect-video bg-smoke-800/50 rounded border border-smoke-700/30 overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-br from-smoke-600 to-smoke-800 flex items-center justify-center">
                            <div className="w-12 h-12 bg-smoke-200 rounded-full"></div>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <span className="text-xs text-smoke-400">WEBP</span>
                          <button className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </div>
                      </div>

                      <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-4">
                        <h3 className="text-smoke-100 font-medium mb-3">Custom Cursor</h3>
                        <div className="aspect-video bg-smoke-800/50 rounded border border-smoke-700/30 flex items-center justify-center">
                          <div className="text-smoke-400 text-center">
                            <div className="w-8 h-8 mx-auto mb-2 opacity-50">🎯</div>
                            <span className="text-xs">WEBP</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-between">
                          <span className="text-xs text-smoke-400">WEBP</span>
                          <button className="text-xs text-red-400 hover:text-red-300">✕</button>
                        </div>
                      </div>
                    </div>

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
                  <div className="bg-smoke-900/50 border border-smoke-700/50 rounded-lg p-6">
                    <h2 className="text-2xl font-bold text-smoke-100 mb-6">Customize</h2>
                    <p className="text-smoke-400">Customization options will be available here.</p>
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