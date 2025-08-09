-- Create storage buckets for file uploads
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('backgrounds', 'backgrounds', false),
  ('audio', 'audio', false),
  ('avatars', 'avatars', true),
  ('cursors', 'cursors', true);

-- Create policies for background uploads
CREATE POLICY "Users can upload their own backgrounds" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own backgrounds" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own backgrounds" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own backgrounds" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'backgrounds' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for audio uploads
CREATE POLICY "Users can upload their own audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own audio" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own audio" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'audio' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for avatar uploads
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create policies for cursor uploads
CREATE POLICY "Cursor images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cursors');

CREATE POLICY "Users can upload their own cursor" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'cursors' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own cursor" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'cursors' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own cursor" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'cursors' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add audio_url column to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS audio_url text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url text;