-- These policies grant permissions for users to manage their own product images in the 'product-images' storage bucket.

-- 1. Allow authenticated users to upload images into a folder named with their user ID.
-- This ensures that users can only upload files to their own designated folder, enhancing security.
CREATE POLICY "Allow authenticated user uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 2. Allow authenticated users to delete their own images.
-- This is necessary for the feature that cleans up uploaded images if the database listing fails,
-- and will be useful for any future "edit/delete listing" functionality.
CREATE POLICY "Allow authenticated user deletes"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- 3. Allow authenticated users to update their own images.
-- While not used yet, this is good to have for future editing features.
CREATE POLICY "Allow authenticated user updates"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'product-images' AND
  auth.role() = 'authenticated' AND
  (storage.foldername(name))[1] = auth.uid()::text
); 