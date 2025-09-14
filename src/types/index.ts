// Core types for the application
export interface User {
  id: string;
  email: string;
  user_metadata: {
    username?: string;
  };
  created_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  username: string;
  bio: string | null;
  avatar_url: string | null;
  background_video_url: string | null;
  audio_url: string | null;
  primary_color: string;
  accent_color: string;
  theme: 'dark' | 'light' | 'system';
  cursor_style: 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom';
  custom_cursor_url: string | null;
  background_effect: 'none' | 'rain' | 'snow' | 'particles';
  username_effect: 'none' | 'glow' | 'shadow' | 'neon';
  location: string | null;
  profile_opacity: number;
  profile_blur: number;
  enable_gradient: boolean;
  monochrome_icons: boolean;
  animated_title: boolean;
  volume_control: boolean;
  view_count: number;
  sequential_id: number;
  created_at: string;
  updated_at: string;
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
  created_at: string;
}

export interface ProfileView {
  id: string;
  profile_user_id: string;
  viewer_user_id: string | null;
  viewer_ip: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CreateProfileData {
  username: string;
  bio?: string;
  avatar_url?: string;
  background_video_url?: string;
  audio_url?: string;
  primary_color?: string;
  accent_color?: string;
  theme?: 'dark' | 'light' | 'system';
  cursor_style?: 'default' | 'pointer' | 'crosshair' | 'neon-dot' | 'custom';
  custom_cursor_url?: string;
}

export interface CreateSocialLinkData {
  name: string;
  url: string;
  icon: string;
  color?: string;
  is_visible?: boolean;
  order_index?: number;
}