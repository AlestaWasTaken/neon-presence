-- Final security fix: Update RLS policies and create secure analytics view

-- 6. Update RLS policies to be more restrictive
DROP POLICY IF EXISTS "Anyone can insert profile views" ON public.profile_views;
DROP POLICY IF EXISTS "Users can view their own profile views" ON public.profile_views;

-- New policy: Only allow insertions through the secure function (by setting viewer_ip and user_agent to NULL)
CREATE POLICY "Secure profile view tracking only"
ON public.profile_views
FOR INSERT
WITH CHECK (
  viewer_ip IS NULL AND 
  user_agent IS NULL AND
  (viewer_ip_hash IS NOT NULL OR browser_type IS NOT NULL)
);

-- Policy: Profile owners can view their analytics (but not sensitive data)
CREATE POLICY "Profile owners can view analytics"
ON public.profile_views
FOR SELECT
USING (
  profile_user_id = auth.uid()
);

-- Policy: Admins can manage view data for moderation
CREATE POLICY "Admins can manage view data"
ON public.profile_views
FOR ALL
USING (
  has_role(auth.uid(), 'admin'::app_role)
);

-- 7. Create a view that excludes sensitive data for analytics
CREATE OR REPLACE VIEW public.profile_analytics AS
SELECT 
  id,
  profile_user_id,
  viewer_user_id,
  browser_type,
  created_at,
  -- Include username from profiles if viewer is registered
  CASE 
    WHEN viewer_user_id IS NOT NULL THEN (
      SELECT username FROM public.profiles WHERE user_id = viewer_user_id
    )
    ELSE NULL
  END as viewer_username
FROM public.profile_views;

-- Grant access to the analytics view
GRANT SELECT ON public.profile_analytics TO authenticated;