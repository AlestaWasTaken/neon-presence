-- Create table to track profile views
CREATE TABLE public.profile_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  profile_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  viewer_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  viewer_ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profile_views ENABLE ROW LEVEL SECURITY;

-- Create policies for profile_views
CREATE POLICY "Users can view their own profile views" 
ON public.profile_views 
FOR SELECT 
USING (profile_user_id = auth.uid());

CREATE POLICY "Anyone can insert profile views" 
ON public.profile_views 
FOR INSERT 
WITH CHECK (true);

-- Create index for better performance
CREATE INDEX idx_profile_views_profile_user_id ON public.profile_views(profile_user_id);
CREATE INDEX idx_profile_views_created_at ON public.profile_views(created_at);

-- Add view count to profiles table
ALTER TABLE public.profiles ADD COLUMN view_count INTEGER DEFAULT 0;

-- Create function to increment view count
CREATE OR REPLACE FUNCTION public.increment_profile_view_count()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = ''
LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.profiles 
  SET view_count = view_count + 1 
  WHERE user_id = NEW.profile_user_id;
  RETURN NEW;
END;
$$;

-- Create trigger to auto-increment view count
CREATE TRIGGER increment_view_count_trigger
  AFTER INSERT ON public.profile_views
  FOR EACH ROW
  EXECUTE FUNCTION public.increment_profile_view_count();