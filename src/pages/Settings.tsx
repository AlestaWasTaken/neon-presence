import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ProfileSettings from '@/components/ProfileSettings';
import { SocialLinks } from '@/components/SocialLinks';
import CursorStyle from '@/components/CursorStyle';
import OptimizedVideoBackground from '@/components/OptimizedVideoBackground';
import { EnhancedVideoBackground } from '@/components/EnhancedVideoBackground';
import ViewAnalytics from '@/components/ViewAnalytics';
import ViewStats from '@/components/ViewStats';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, User, Palette, Mouse, Video, BarChart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

export default function Settings() {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useProfile();

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
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-smoke-700/50 glass">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2 text-smoke-300 hover:text-smoke-100">
                    <ArrowLeft className="w-4 h-4" />
                    Back
                  </Button>
                </Link>
                <h1 className="text-xl font-black text-smoke-100">Dashboard</h1>
              </div>
              <Link to={`/${profile?.username || user.id}`}>
                <Button variant="ghost" size="sm" className="text-smoke-300 hover:text-smoke-100">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="container mx-auto px-6 py-12">
          <Tabs defaultValue="profile" className="space-y-8 max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-5 glass border-smoke-700/30">
              <TabsTrigger value="profile" className="gap-2 text-smoke-400 data-[state=active]:text-smoke-100">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2 text-smoke-400 data-[state=active]:text-smoke-100">
                <Palette className="w-4 h-4" />
                Theme
              </TabsTrigger>
              <TabsTrigger value="cursor" className="gap-2 text-smoke-400 data-[state=active]:text-smoke-100">
                <Mouse className="w-4 h-4" />
                Cursor
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2 text-smoke-400 data-[state=active]:text-smoke-100">
                <Video className="w-4 h-4" />
                Background
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2 text-smoke-400 data-[state=active]:text-smoke-100">
                <BarChart className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-8">
              <Card className="glass border-smoke-700/30 shadow-deep">
                <CardHeader className="pb-4">
                  <CardTitle className="text-smoke-100">Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileSettings />
                </CardContent>
              </Card>

              <Card className="glass border-smoke-700/30 shadow-deep">
                <CardHeader className="pb-4">
                  <CardTitle className="text-smoke-100">Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinks />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-8">
              <Card className="glass border-smoke-700/30 shadow-deep">
                <CardHeader className="pb-4">
                  <CardTitle className="text-smoke-100">Digital Hideout Theme</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-smoke-200 mb-2">Active Theme</h3>
                      <p className="text-xs text-smoke-400 mb-4">
                        Deep blacks and smoky grays for understated cool
                      </p>
                    </div>
                    <div className="p-6 glass border-smoke-700/20 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-gradient-smoke flex items-center justify-center">
                          <div className="w-6 h-6 rounded-full bg-smoke-100/80" />
                        </div>
                        <div>
                          <h4 className="font-medium text-smoke-200">Hideout</h4>
                          <p className="text-xs text-smoke-400">Bold but subtle, raw but refined</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cursor" className="space-y-8">
              <Card className="glass border-smoke-700/30 shadow-deep">
                <CardHeader className="pb-4">
                  <CardTitle className="text-smoke-100">Cursor Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <CursorStyle />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="space-y-8">
              <Card className="glass border-smoke-700/30 shadow-deep">
                <CardHeader className="pb-4">
                  <CardTitle className="text-smoke-100">Background Video</CardTitle>
                  <p className="text-xs text-smoke-400">
                    Set the mood with a seamless video background
                  </p>
                </CardHeader>
                <CardContent>
                  <EnhancedVideoBackground 
                    profileUserId={user.id} 
                    userAuthId={user.id} 
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-8">
              <div className="grid gap-8 md:grid-cols-2">
                <Card className="glass border-smoke-700/30 shadow-deep">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-smoke-100">Profile Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ViewStats />
                  </CardContent>
                </Card>

                <Card className="glass border-smoke-700/30 shadow-deep">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-smoke-100">Analytics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ViewAnalytics />
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}