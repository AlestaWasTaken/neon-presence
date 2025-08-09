import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

export interface ProfileView {
  id: string;
  profile_user_id: string;
  viewer_user_id?: string;
  viewer_ip?: string;
  user_agent?: string;
  created_at: string;
}

export function useProfileViews(profileUserId?: string) {
  const [viewCount, setViewCount] = useState(0);
  const [recentViews, setRecentViews] = useState<ProfileView[]>([]);
  const [activeViewers, setActiveViewers] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    if (!profileUserId) return;

    // Get initial view count
    fetchViewCount();
    
    // Check if we should track this view (prevent F5 spam)
    const shouldTrack = shouldTrackView(profileUserId);
    
    if (shouldTrack) {
      // Track current view if not own profile
      if (user && user.id !== profileUserId) {
        trackView();
      } else if (!user) {
        // Anonymous view
        trackView();
      }
    }

    // Set up real-time presence tracking
    const channel = supabase.channel(`profile_${profileUserId}`)
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        setActiveViewers(Object.keys(state).length);
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        console.log('New viewer joined:', key, newPresences);
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        console.log('Viewer left:', key, leftPresences);
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return;

        // Track presence
        const presenceTrackStatus = await channel.track({
          user_id: user?.id || 'anonymous',
          online_at: new Date().toISOString(),
        });
        console.log('Presence track status:', presenceTrackStatus);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profileUserId, user]);

  // Function to check if we should track a view (prevent F5 spam)
  const shouldTrackView = (userId: string): boolean => {
    const storageKey = `profile_view_${userId}`;
    const lastView = localStorage.getItem(storageKey);
    const now = Date.now();
    const viewCooldown = 5 * 60 * 1000; // 5 minutes cooldown

    if (lastView && (now - parseInt(lastView)) < viewCooldown) {
      return false; // Don't track if viewed recently
    }

    // Update last view time
    localStorage.setItem(storageKey, now.toString());
    return true;
  };

  const fetchViewCount = async () => {
    if (!profileUserId) return;

    const { data: profile } = await supabase
      .from('profiles')
      .select('view_count')
      .eq('user_id', profileUserId)
      .single();

    if (profile) {
      setViewCount(profile.view_count || 0);
    }
  };

  const fetchRecentViews = async () => {
    if (!profileUserId || !user || user.id !== profileUserId) return;

    const { data, error } = await supabase
      .from('profile_views')
      .select('*')
      .eq('profile_user_id', profileUserId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (data && !error) {
      setRecentViews(data);
    }
  };

  const trackView = async () => {
    if (!profileUserId) return;

    try {
      const { error } = await supabase
        .from('profile_views')
        .insert({
          profile_user_id: profileUserId,
          viewer_user_id: user?.id || null,
          viewer_ip: null, // Could be populated from a server function
          user_agent: navigator.userAgent
        });

      if (error) {
        console.error('Error tracking view:', error);
      } else {
        // Refresh view count
        fetchViewCount();
      }
    } catch (error) {
      console.error('Error tracking view:', error);
    }
  };

  return {
    viewCount,
    activeViewers,
    recentViews,
    fetchRecentViews
  };
}