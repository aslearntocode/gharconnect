-- Add images column to posts table
ALTER TABLE posts ADD COLUMN IF NOT EXISTS images TEXT[] DEFAULT '{}';

-- Add comment to the column
COMMENT ON COLUMN posts.images IS 'Array of image URLs stored in Supabase storage connect bucket'; 