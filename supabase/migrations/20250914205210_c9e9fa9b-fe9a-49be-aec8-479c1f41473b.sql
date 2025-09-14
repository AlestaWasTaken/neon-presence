-- Drop the existing function first
DROP FUNCTION IF EXISTS track_profile_view(uuid,uuid,text,text);

-- Enable RLS on the profile_views table
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