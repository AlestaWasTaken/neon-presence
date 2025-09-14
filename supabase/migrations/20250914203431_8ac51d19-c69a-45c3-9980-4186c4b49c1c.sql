-- Security fix for profile_views table: Implement data minimization and privacy protection

-- 1. Create a function to hash IP addresses for privacy
CREATE OR REPLACE FUNCTION public.hash_ip_address(ip_address text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return NULL if IP is null or empty
  IF ip_address IS NULL OR ip_address = '' THEN
    RETURN NULL;
  END IF;
  
  -- Hash the IP address with a salt for privacy (one-way hash)
  -- This allows us to detect unique visitors without storing actual IPs
  RETURN encode(digest(ip_address || 'privacy_salt_2024', 'sha256'), 'hex');
END;
$$;

-- 2. Create a function to sanitize user agent strings
CREATE OR REPLACE FUNCTION public.sanitize_user_agent(user_agent text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Return NULL if user_agent is null or empty
  IF user_agent IS NULL OR user_agent = '' THEN
    RETURN NULL;
  END IF;
  
  -- Extract only basic browser info, remove detailed version numbers and system info
  -- This provides analytics value while protecting detailed fingerprinting data
  CASE 
    WHEN user_agent ILIKE '%chrome%' THEN RETURN 'Chrome'
    WHEN user_agent ILIKE '%firefox%' THEN RETURN 'Firefox'
    WHEN user_agent ILIKE '%safari%' AND user_agent NOT ILIKE '%chrome%' THEN RETURN 'Safari'
    WHEN user_agent ILIKE '%edge%' THEN RETURN 'Edge'
    WHEN user_agent ILIKE '%opera%' THEN RETURN 'Opera'
    ELSE RETURN 'Other'
  END;
END;
$$;

-- 3. Add new columns for hashed data
ALTER TABLE public.profile_views 
ADD COLUMN IF NOT EXISTS viewer_ip_hash text,
ADD COLUMN IF NOT EXISTS browser_type text;

-- 4. Create a secure view tracking function that processes data safely
CREATE OR REPLACE FUNCTION public.track_profile_view(
  p_profile_user_id uuid,
  p_viewer_user_id uuid DEFAULT NULL,
  p_viewer_ip text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  view_id uuid;
  hashed_ip text;
  browser_type text;
BEGIN
  -- Process sensitive data securely
  hashed_ip := hash_ip_address(p_viewer_ip);
  browser_type := sanitize_user_agent(p_user_agent);
  
  -- Insert the view record with processed data only
  INSERT INTO public.profile_views (
    profile_user_id,
    viewer_user_id,
    viewer_ip_hash,
    browser_type,
    created_at
  ) VALUES (
    p_profile_user_id,
    p_viewer_user_id,
    hashed_ip,
    browser_type,
    now()
  ) RETURNING id INTO view_id;
  
  RETURN view_id;
END;
$$;

-- 5. Create a function to clean up old view data (data retention)
CREATE OR REPLACE FUNCTION public.cleanup_old_profile_views()
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  deleted_count integer;
BEGIN
  -- Delete view records older than 90 days to comply with data retention policies
  DELETE FROM public.profile_views 
  WHERE created_at < (now() - interval '90 days');
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$;

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
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
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