-- Add avatar_url and audio_url columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS audio_url TEXT;

-- Update the trigger to handle the new columns
-- (The existing update_updated_at_column function will already work with these new columns)