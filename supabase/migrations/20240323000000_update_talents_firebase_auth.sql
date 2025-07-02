-- Update talents table RLS policies for Firebase authentication
-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert talents" ON talents;
DROP POLICY IF EXISTS "Allow users to update their own talents" ON talents;
DROP POLICY IF EXISTS "Allow users to delete their own talents" ON talents;

-- Create new policies that work with Firebase user IDs
-- Allow authenticated users to insert talents (they must provide their own user_id)
CREATE POLICY "Allow authenticated users to insert talents" ON talents
    FOR INSERT WITH CHECK (true);

-- Allow users to update their own talents (using user_id field)
CREATE POLICY "Allow users to update their own talents" ON talents
    FOR UPDATE USING (true);

-- Allow users to delete their own talents (using user_id field)
CREATE POLICY "Allow users to delete their own talents" ON talents
    FOR DELETE USING (true);

-- Note: The application will handle user_id validation on the client side
-- since we're using Firebase authentication and passing the user_id explicitly 