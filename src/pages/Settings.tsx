import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ProfileSettings from '@/components/ProfileSettings';
import { SocialLinks } from '@/components/SocialLinks';
import CursorStyle from '@/components/CursorStyle';
import VideoBackground from '@/components/VideoBackground';
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
      <div className="min-h-screen bg-gradient-to-b from-background to-gray-950 flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-gray-950">
      <VideoBackground profileUserId={user.id} />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Profile
                  </Button>
                </Link>
                <h1 className="text-2xl font-bold">Settings</h1>
              </div>
              <Link to={`/${profile?.username || user.id}`}>
                <Button variant="outline" size="sm">
                  View Profile
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Settings Content */}
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="profile" className="gap-2">
                <User className="w-4 h-4" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </TabsTrigger>
              <TabsTrigger value="cursor" className="gap-2">
                <Mouse className="w-4 h-4" />
                Cursor
              </TabsTrigger>
              <TabsTrigger value="video" className="gap-2">
                <Video className="w-4 h-4" />
                Background
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart className="w-4 h-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <ProfileSettings />
                </CardContent>
              </Card>

              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Social Links</CardTitle>
                </CardHeader>
                <CardContent>
                  <SocialLinks />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Theme & Colors</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Theme</label>
                      <p className="text-muted-foreground text-sm mt-1">
                        Using minimal dark theme for clean, modern appearance
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="p-4 rounded-lg bg-gradient-card border border-border/50 text-center">
                        <div className="w-8 h-8 rounded-full bg-primary mx-auto mb-2"></div>
                        <span className="text-xs text-muted-foreground">Current</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cursor" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Cursor Style</CardTitle>
                </CardHeader>
                <CardContent>
                  <CursorStyle />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="video" className="space-y-6">
              <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                <CardHeader>
                  <CardTitle>Video Background</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Background Video URL</label>
                      <p className="text-muted-foreground text-sm mt-1">
                        Add a video background to your profile. Optimized for performance and mobile devices.
                      </p>
                    </div>
                    {/* Video settings will be handled by enhanced VideoBackground */}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Profile Views</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ViewStats />
                  </CardContent>
                </Card>

                <Card className="bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <CardTitle>Analytics</CardTitle>
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