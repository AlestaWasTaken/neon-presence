import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

interface TrackViewParams {
  profileUserId: string;
}

export function useSecureTracking() {
  const { user } = useAuth();

  const trackView = async ({ profileUserId }: TrackViewParams) => {
    try {
      // Use the secure edge function for tracking
      const { data, error } = await supabase.functions.invoke('track-view', {
        body: {
          profileUserId,
          viewerUserId: user?.id || null
        }
      });

      if (error) {
        console.error('Error tracking view:', error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.error('Unexpected error tracking view:', error);
      return { success: false, error };
    }
  };

  return { trackView };
}