-- Fix security definer view issue
DROP VIEW IF EXISTS public.profile_analytics;

-- Create analytics view without security definer
CREATE VIEW public.profile_analytics AS
SELECT 
  id,
  profile_user_id,
  viewer_user_id,
  browser_type,
  created_at
FROM public.profile_views;

-- Enable RLS on the view
ALTER VIEW public.profile_analytics SET (security_invoker = true);

-- Grant access to the analytics view
GRANT SELECT ON public.profile_analytics TO authenticated;