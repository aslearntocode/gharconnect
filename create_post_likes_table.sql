-- SQL to create post_likes table if it doesn't exist
CREATE TABLE IF NOT EXISTS post_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, post_id)
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON post_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_post_id ON post_likes(post_id);

-- Add RLS policies if needed
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own likes
CREATE POLICY IF NOT EXISTS "Users can insert their own likes" ON post_likes
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to view all likes
CREATE POLICY IF NOT EXISTS "Users can view all likes" ON post_likes
    FOR SELECT USING (true);
