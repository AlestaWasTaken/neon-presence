import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';
import { useAuth } from '@/hooks/useAuth';

interface CursorStyleProps {
  profileUserId?: string;
}

const CursorStyle = ({ profileUserId }: CursorStyleProps) => {
  const { user } = useAuth();
  const { profile } = useProfile();
  const [cursorData, setCursorData] = useState<{
    cursor_style: string;
    custom_cursor_url: string | null;
  } | null>(null);

  useEffect(() => {
    if (profileUserId && profileUserId !== user?.id) {
      // Fetch other user's profile data
      fetchOtherUserProfile();
    } else if (user?.id === profileUserId && profile) {
      // Use current user's profile
      setCursorData({
        cursor_style: profile.cursor_style || 'default',
        custom_cursor_url: profile.custom_cursor_url
      });
    }
  }, [profileUserId, user, profile]);

  const fetchOtherUserProfile = async () => {
    if (!profileUserId) return;

    const { data } = await supabase
      .from('profiles')
      .select('cursor_style, custom_cursor_url')
      .eq('user_id', profileUserId)
      .single();

    if (data) {
      setCursorData(data);
    }
  };

  useEffect(() => {
    if (!cursorData) return;

    const body = document.body;
    
    // Remove any existing cursor classes
    const cursorClasses = ['cursor-default', 'cursor-pointer', 'cursor-crosshair', 'cursor-neon-dot', 'cursor-custom'];
    cursorClasses.forEach(cls => body.classList.remove(cls));

    // Apply cursor style
    switch (cursorData.cursor_style) {
      case 'pointer':
        body.style.cursor = 'pointer';
        break;
      case 'crosshair':
        body.style.cursor = 'crosshair';
        break;
      case 'neon-dot':
        body.classList.add('cursor-neon-dot');
        break;
      case 'custom':
        if (cursorData.custom_cursor_url) {
          body.style.cursor = `url('${cursorData.custom_cursor_url}'), auto`;
        } else {
          body.style.cursor = 'default';
        }
        break;
      default:
        body.style.cursor = 'default';
    }

    return () => {
      // Cleanup on unmount
      body.style.cursor = 'default';
      cursorClasses.forEach(cls => body.classList.remove(cls));
    };
  }, [cursorData]);

  return null; // This component doesn't render anything
};

export default CursorStyle;