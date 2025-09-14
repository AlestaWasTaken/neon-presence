import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Calendar, TrendingUp, User } from 'lucide-react';
import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import { tr } from 'date-fns/locale';

interface ViewAnalyticsProps {
  profileUserId?: string;
}

interface Viewer {
  id: string;
  username: string | null;
  viewer_user_id: string | null;
  browser_type: string | null;
  created_at: string;
}

interface Analytics {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  viewers: Viewer[];
  dailyViews: Array<{ date: string; views: number }>;
}

export default function ViewAnalytics({ profileUserId }: ViewAnalyticsProps) {
  const [analytics, setAnalytics] = useState<Analytics>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    viewers: [],
    dailyViews: []
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

      const now = new Date();
      const today = startOfDay(now);
      const weekAgo = subDays(today, 7);
      const monthAgo = subDays(today, 30);

      // Get total views from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('view_count')
        .eq('user_id', profileUserId)
        .single();

      // Get today's views
      const { count: todayResult } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_user_id', profileUserId)
        .gte('created_at', today.toISOString());

      // Get week's views
      const { count: weekResult } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_user_id', profileUserId)
        .gte('created_at', weekAgo.toISOString());

      // Get month's views
      const { count: monthResult } = await supabase
        .from('profile_views')
        .select('*', { count: 'exact', head: true })
        .eq('profile_user_id', profileUserId)
        .gte('created_at', monthAgo.toISOString());

      // Get recent viewers with usernames - now using secure analytics view
      const { data: viewersResult } = await supabase
        .from('profile_analytics')
        .select(`
          id,
          viewer_user_id,
          browser_type,
          created_at,
          username
        `)
        .eq('profile_user_id', profileUserId)
        .not('viewer_user_id', 'is', null)
        .order('created_at', { ascending: false })
        .limit(50);

      // Get daily views for the last 30 days
      const dailyViewsData = [];
      for (let i = 29; i >= 0; i--) {
        const date = subDays(today, i);
        const nextDate = subDays(today, i - 1);
        
        const { count } = await supabase
          .from('profile_views')
          .select('*', { count: 'exact', head: true })
          .eq('profile_user_id', profileUserId)
          .gte('created_at', startOfDay(date).toISOString())
          .lt('created_at', startOfDay(nextDate).toISOString());

        dailyViewsData.push({
          date: format(date, 'dd MMM', { locale: tr }),
          views: count || 0
        });
      }

      setAnalytics({
        totalViews: profile?.view_count || 0,
        todayViews: todayResult || 0,
        weekViews: weekResult || 0,
        monthViews: monthResult || 0,
        viewers: (viewersResult || []).map((viewer: any) => ({
          id: viewer.id,
          username: viewer.username || 'Anonymous User',
          viewer_user_id: viewer.viewer_user_id,
          browser_type: viewer.browser_type,
          created_at: viewer.created_at
        })),
        dailyViews: dailyViewsData
      });

    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-700 rounded"></div>
            ))}
          </div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Profile Analytics</h2>
        <p className="text-gray-400">Track your profile's performance and visitor insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Toplam Görüntülenme</CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.totalViews.toLocaleString()}</div>
            <p className="text-xs text-gray-400">Tüm zamanlar</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bugün</CardTitle>
            <Calendar className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.todayViews}</div>
            <p className="text-xs text-gray-400">Son 24 saat</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bu Hafta</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.weekViews}</div>
            <p className="text-xs text-gray-400">Son 7 gün</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">Bu Ay</CardTitle>
            <Users className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{analytics.monthViews}</div>
            <p className="text-xs text-gray-400">Son 30 gün</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Views Chart */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Son 30 Gün Görüntülenme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-between gap-1">
              {analytics.dailyViews.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-purple-600 rounded-t transition-all duration-300 hover:bg-purple-500"
                    style={{
                      height: `${Math.max((day.views / Math.max(...analytics.dailyViews.map(d => d.views))) * 200, 2)}px`
                    }}
                    title={`${day.date}: ${day.views} görüntülenme`}
                  />
                  <span className="text-xs text-gray-400 mt-1 transform rotate-45 origin-left">
                    {day.date}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Viewers */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Users className="w-5 h-5" />
              Kimler Baktı ({analytics.viewers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {analytics.viewers.length === 0 ? (
                <p className="text-gray-400 text-sm text-center py-8">
                  Henüz kayıtlı kullanıcı görüntülemesi yok
                </p>
              ) : (
                analytics.viewers.map((viewer) => (
                  <div key={viewer.id} className="flex items-center justify-between p-3 bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-300" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-white">
                            {viewer.username || 'Anonymous User'}
                          </p>
                          {viewer.browser_type && (
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                              {viewer.browser_type}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {format(new Date(viewer.created_at), 'dd MMM yyyy, HH:mm', { locale: tr })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}