-- Make backgrounds bucket public for video display
UPDATE storage.buckets SET public = true WHERE id = 'backgrounds';

-- Add missing customization columns to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS background_effect text DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username_effect text DEFAULT 'none';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_opacity integer DEFAULT 100;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS profile_blur integer DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS enable_gradient boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS monochrome_icons boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS animated_title boolean DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS volume_control boolean DEFAULT true;