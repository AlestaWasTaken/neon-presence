import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface ViewStats {
  totalViews: number;
  todayViews: number;
  weekViews: number;
  monthViews: number;
  recentViewers: Array<{
    id: string;
    created_at: string;
    viewer_user_id?: string;
    viewer_ip?: string;
  }>;
}

export function useViewStats(profileUserId?: string) {
  const [stats, setStats] = useState<ViewStats>({
    totalViews: 0,
    todayViews: 0,
    weekViews: 0,
    monthViews: 0,
    recentViewers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileUserId) {
      fetchStats();
    }
  }, [profileUserId]);

  const fetchStats = async () => {
    if (!profileUserId) return;

    try {
      setLoading(true);

      // Get total views from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('view_count')
        .eq('user_id', profileUserId)
        .single();

      // Get time-based views
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const [todayResult, weekResult, monthResult, recentResult] = await Promise.all([
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
          .select('id, created_at, viewer_user_id, viewer_ip')
          .eq('profile_user_id', profileUserId)
          .order('created_at', { ascending: false })
          .limit(10)
      ]);

      setStats({
        totalViews: profile?.view_count || 0,
        todayViews: todayResult.count || 0,
        weekViews: weekResult.count || 0,
        monthViews: monthResult.count || 0,
        recentViewers: recentResult.data || [],
      });
    } catch (error) {
      console.error('Error fetching view stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const recordView = async (profileUserId: string) => {
    try {
      // Insert view record
      const { error } = await supabase
        .from('profile_views')
        .insert({
          profile_user_id: profileUserId,
        });

      if (error) {
        console.error('Error recording view:', error);
      }
    } catch (error) {
      console.error('Error recording view:', error);
    }
  };

  return {
    stats,
    loading,
    recordView,
    refetch: fetchStats,
  };
}