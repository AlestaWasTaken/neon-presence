-- Add video background and cursor customization to profiles
ALTER TABLE public.profiles ADD COLUMN background_video_url TEXT;
ALTER TABLE public.profiles ADD COLUMN cursor_style TEXT DEFAULT 'default' CHECK (cursor_style IN ('default', 'pointer', 'crosshair', 'neon-dot', 'custom'));
ALTER TABLE public.profiles ADD COLUMN custom_cursor_url TEXT;