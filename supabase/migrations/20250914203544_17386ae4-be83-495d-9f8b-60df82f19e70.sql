-- Continue security fix: Add new secure columns and functions

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