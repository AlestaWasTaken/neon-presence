-- Create RLS policies for storage buckets

-- Background videos bucket policies
CREATE POLICY "Users can upload their own background videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own background videos" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own background videos" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own background videos" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'backgrounds' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Audio bucket policies
CREATE POLICY "Users can upload their own audio files" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can view their own audio files" 
ON storage.objects 
FOR SELECT 
USING (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own audio files" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own audio files" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'audio' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Avatar bucket policies (public bucket - more permissive)
CREATE POLICY "Anyone can view avatars" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatars" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own avatars" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own avatars" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'avatars' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Cursor bucket policies (public bucket - more permissive)  
CREATE POLICY "Anyone can view cursors" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'cursors');

CREATE POLICY "Users can upload their own cursors" 
ON storage.objects 
FOR INSERT 
WITH CHECK (
  bucket_id = 'cursors' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can update their own cursors" 
ON storage.objects 
FOR UPDATE 
USING (
  bucket_id = 'cursors' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Users can delete their own cursors" 
ON storage.objects 
FOR DELETE 
USING (
  bucket_id = 'cursors' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);