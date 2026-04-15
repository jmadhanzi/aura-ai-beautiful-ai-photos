-- Fix: restrict SELECT to user's own folder to prevent public listing
DROP POLICY "Anyone can view photos" ON storage.objects;

CREATE POLICY "Users can view their own photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'photos' AND auth.uid()::text = (storage.foldername(name))[1]);