-- Fix: Drop existing function and recreate with correct signature
DROP FUNCTION IF EXISTS public.sanitize_user_agent(text);

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