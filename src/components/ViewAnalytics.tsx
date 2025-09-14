import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ProfileView } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Users, TrendingUp, Clock, User, Globe, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ViewerInfo {
  id: string;
  created_at: string;
  viewer_user_id: string | null;
  viewer_ip: string | null;
  user_agent: string | null;
  profiles?: {
    username: string;
    avatar_url: string | null;
  } | null;
}

interface AnalyticsData {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  viewers: ViewerInfo[];
  dailyStats: Array<{
    date: string;
    views: number;
  }>;
}

interface ViewAnalyticsProps {
  profileUserId?: string;
}

export default function ViewAnalytics({ profileUserId }: ViewAnalyticsProps) {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    viewers: [],
    dailyStats: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileUserId) {
      fetchAnalytics();
    }
  }, [profileUserId]);

  const fetchAnalytics = async () => {
    if (!profileUserId) return;

    try {
      setLoading(true);

      // Get total views from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('view_count')
        .eq('user_id', profileUserId)
        .single();

      // Time ranges
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      // Get time-based views and detailed viewer info
      const [todayResult, weekResult, monthResult, viewersResult] = await Promise.all([
        supabase
          .from('profile_views')
          .select('id', { count: 'exact' })
          .eq('profile_user_id', profileUserId)
          .gte('created_at', today.toISOString()),
        
        supabase
          .from('profile_views')
          .select('id', { count: 'exact' })
          .eq('profile_user_id', profileUserId)
          .gte('created_at', weekAgo.toISOString()),
        
        supabase
          .from('profile_views')
          .select('id', { count: 'exact' })
          .eq('profile_user_id', profileUserId)
          .gte('created_at', monthAgo.toISOString()),
        
        supabase
          .from('profile_views')
          .select(`
            id,
            created_at,
            viewer_user_id,
            viewer_ip,
            user_agent,
            profiles:viewer_user_id (
              username,
              avatar_url
            )
          `)
          .eq('profile_user_id', profileUserId)
          .order('created_at', { ascending: false })
          .limit(50)
      ]);

      // Get daily stats for the last 30 days
      const dailyStatsResult = await supabase
        .from('profile_views')
        .select('created_at')
        .eq('profile_user_id', profileUserId)
        .gte('created_at', monthAgo.toISOString());

      // Process daily stats
      const dailyStats = [];
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        const views = dailyStatsResult.data?.filter(view => 
          view.created_at.startsWith(dateStr)
        ).length || 0;
        
        dailyStats.push({
          date: dateStr,
          views,
        });
      }

      setAnalytics({
        totalViews: profile?.view_count || 0,
        todayViews: todayResult.count || 0,
        weekViews: weekResult.count || 0,
        monthViews: monthResult.count || 0,
        viewers: (viewersResult.data || []).map((viewer: any) => ({
          ...viewer,
          profiles: Array.isArray(viewer.profiles) ? viewer.profiles[0] : viewer.profiles
        })) as ViewerInfo[],
        dailyStats,
      });
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="glass border-smoke-700/30">
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-smoke-700 rounded w-1/3"></div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-20 bg-smoke-700 rounded"></div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const statItems = [
    {
      label: 'Toplam Görüntülenme',
      value: analytics.totalViews,
      icon: Eye,
      color: 'text-blue-400',
    },
    {
      label: 'Bu Hafta',
      value: analytics.weekViews,
      icon: TrendingUp,
      color: 'text-green-400',
    },
    {
      label: 'Bu Ay',
      value: analytics.monthViews,
      icon: Calendar,
      color: 'text-purple-400',
    },
    {
      label: 'Bugün',
      value: analytics.todayViews,
      icon: Clock,
      color: 'text-orange-400',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statItems.map((item, index) => (
          <Card key={index} className="glass border-smoke-700/30 hover-lift">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-smoke-800/50 ${item.color}`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-smoke-400 font-medium">{item.label}</p>
                  <p className="text-lg font-bold text-smoke-100">{item.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analytics */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="text-smoke-100 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Detaylı Analitik
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="viewers" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 glass border-smoke-700/30">
              <TabsTrigger value="viewers">Ziyaretçiler</TabsTrigger>
              <TabsTrigger value="charts">Grafik</TabsTrigger>
            </TabsList>

            <TabsContent value="viewers" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-smoke-200">Son Ziyaretçiler</h3>
                {analytics.viewers.length === 0 ? (
                  <div className="text-center py-8 text-smoke-400">
                    Henüz ziyaretçi bulunmuyor
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {analytics.viewers.map((viewer) => (
                      <div key={viewer.id} className="flex items-center gap-3 p-3 rounded-lg bg-smoke-900/30 border border-smoke-700/20">
                        <div className="flex-shrink-0">
                          {viewer.profiles?.avatar_url ? (
                            <img
                              src={viewer.profiles.avatar_url}
                              alt={viewer.profiles.username}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-smoke-700 flex items-center justify-center">
                              {viewer.viewer_user_id ? (
                                <User className="w-4 h-4 text-smoke-400" />
                              ) : (
                                <Globe className="w-4 h-4 text-smoke-400" />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-smoke-200 truncate">
                            {viewer.profiles?.username || 'Anonim Ziyaretçi'}
                          </p>
                          <p className="text-xs text-smoke-400">
                            {format(new Date(viewer.created_at), 'dd MMM yyyy HH:mm', { locale: tr })}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="text-xs text-smoke-500">
                            {viewer.viewer_user_id ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/20 text-green-400">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                                Kayıtlı
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-orange-500/20 text-orange-400">
                                <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                Misafir
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="charts" className="space-y-4">
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-smoke-200">Son 30 Gün Görüntülenme</h3>
                <div className="h-40 flex items-end gap-1 bg-smoke-900/30 rounded-lg p-4">
                  {analytics.dailyStats.map((stat, index) => {
                    const maxViews = Math.max(...analytics.dailyStats.map(s => s.views));
                    const height = maxViews > 0 ? (stat.views / maxViews) * 100 : 0;
                    
                    return (
                      <div
                        key={index}
                        className="flex-1 flex flex-col items-center group relative"
                      >
                        <div
                          className="w-full bg-gradient-to-t from-primary/50 to-primary rounded-t min-h-[2px] transition-all group-hover:from-primary/70 group-hover:to-primary"
                          style={{ height: `${height}%` }}
                        />
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity bg-smoke-800 text-xs px-2 py-1 rounded whitespace-nowrap">
                          {stat.views} görüntülenme
                          <br />
                          {format(new Date(stat.date), 'dd MMM', { locale: tr })}
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between text-xs text-smoke-500">
                  <span>30 gün önce</span>
                  <span>Bugün</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}