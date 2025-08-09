import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  primary_color: string;
  accent_color: string;
  theme: 'neon' | 'minimal' | 'cyberpunk';
  background_video_url: string | null;
  cursor_style: 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom';
  custom_cursor_url: string | null;
  avatar_url: string | null;
  audio_url: string | null;
}

export interface SocialLink {
  id: string;
  user_id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  is_visible: boolean;
  order_index: number;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchSocialLinks();
    } else {
      setProfile(null);
      setSocialLinks([]);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching profile:', error);
      toast({
        variant: "destructive",
        title: "Profil yüklenemedi",
        description: error.message
      });
    } else {
      setProfile(data as any as Profile);
    }
    setLoading(false);
  };

  const fetchSocialLinks = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('social_links')
      .select('*')
      .eq('user_id', user.id)
      .order('order_index');

    if (error) {
      console.error('Error fetching social links:', error);
    } else {
      setSocialLinks(data || []);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    console.log('Updating profile with:', updates);

    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('user_id', user.id);

    if (error) {
      console.error('Profile update error:', error);
      toast({
        variant: "destructive",
        title: "Profil güncellenemedi",
        description: error.message
      });
      throw error;
    } else {
      // Profile'ı yeniden fetch et ki güncel veri gelsin
      await fetchProfile();
      toast({
        title: "Profil güncellendi",
        description: "Değişiklikler kaydedildi."
      });
    }
  };

  const addSocialLink = async (link: Omit<SocialLink, 'id' | 'user_id'>) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('social_links')
      .insert({ ...link, user_id: user.id })
      .select()
      .single();

    if (error) {
      toast({
        variant: "destructive",
        title: "Link eklenemedi",
        description: error.message
      });
    } else {
      setSocialLinks([...socialLinks, data]);
      toast({
        title: "Link eklendi",
        description: "Sosyal medya linki başarıyla eklendi."
      });
    }
  };

  const updateSocialLink = async (id: string, updates: Partial<SocialLink>) => {
    const { error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Link güncellenemedi",
        description: error.message
      });
    } else {
      setSocialLinks(socialLinks.map(link => 
        link.id === id ? { ...link, ...updates } : link
      ));
    }
  };

  const deleteSocialLink = async (id: string) => {
    const { error } = await supabase
      .from('social_links')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        variant: "destructive",
        title: "Link silinemedi",
        description: error.message
      });
    } else {
      setSocialLinks(socialLinks.filter(link => link.id !== id));
      toast({
        title: "Link silindi",
        description: "Sosyal medya linki başarıyla silindi."
      });
    }
  };

  return {
    profile,
    socialLinks,
    loading,
    updateProfile,
    addSocialLink,
    updateSocialLink,
    deleteSocialLink
  };
}