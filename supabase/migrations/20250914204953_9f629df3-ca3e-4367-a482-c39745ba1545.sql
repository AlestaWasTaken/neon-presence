-- Create proper RLS policies for profile_analytics view
-- This ensures users can only see analytics for their own profiles

-- First, let's create the profile_analytics view if it doesn't exist
CREATE OR REPLACE VIEW profile_analytics AS
SELECT 
  pv.id,
  pv.profile_user_id,
  pv.viewer_user_id,
  pv.browser_type,
  pv.created_at,
  p.username
FROM profile_views pv
LEFT JOIN profiles p ON pv.viewer_user_id = p.user_id;

-- Enable RLS on the profile_views table (the underlying table)
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view profile analytics for their own profiles
CREATE POLICY "Users can view analytics for their own profiles" 
ON profile_views 
FOR SELECT 
USING (
  profile_user_id = auth.uid()
);

-- Create policy to allow users to insert views for any profile (for tracking)
CREATE POLICY "Anyone can insert profile views" 
ON profile_views 
FOR INSERT 
WITH CHECK (true);

-- Create policy for automatic cleanup (system access)
CREATE POLICY "System can delete old profile views" 
ON profile_views 
FOR DELETE 
USING (created_at < (now() - interval '90 days'));

-- Update the track_profile_view function to use proper security
CREATE OR REPLACE FUNCTION track_profile_view(
  profile_user_id_param UUID,
  viewer_user_id_param UUID DEFAULT NULL,
  ip_address_param TEXT DEFAULT NULL,
  user_agent_param TEXT DEFAULT NULL
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  hashed_ip TEXT;
  sanitized_ua TEXT;
  browser_type TEXT;
BEGIN
  -- Hash IP address for privacy
  IF ip_address_param IS NOT NULL THEN
    hashed_ip := hash_ip_address(ip_address_param);
  END IF;
  
  -- Sanitize user agent
  IF user_agent_param IS NOT NULL THEN
    sanitized_ua := sanitize_user_agent(user_agent_param);
    browser_type := CASE
      WHEN sanitized_ua ILIKE '%chrome%' THEN 'Chrome'
      WHEN sanitized_ua ILIKE '%firefox%' THEN 'Firefox'
      WHEN sanitized_ua ILIKE '%safari%' THEN 'Safari'
      WHEN sanitized_ua ILIKE '%edge%' THEN 'Edge'
      ELSE 'Other'
    END;
  END IF;
  
  -- Insert the view record
  INSERT INTO profile_views (
    profile_user_id,
    viewer_user_id,
    ip_address_hash,
    user_agent,
    browser_type
  ) VALUES (
    profile_user_id_param,
    viewer_user_id_param,
    hashed_ip,
    sanitized_ua,
    browser_type
  );
  
  -- Update view count on profile
  UPDATE profiles 
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE user_id = profile_user_id_param;
END;
$$;