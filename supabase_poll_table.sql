-- Create poll_votes table for storing user poll responses
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Ensure one vote per user per poll
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_option_id ON poll_votes(option_id);

-- Enable Row Level Security (RLS)
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to insert their own votes
CREATE POLICY "Users can insert their own votes" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to view all votes (for results)
CREATE POLICY "Users can view all votes" ON poll_votes
  FOR SELECT USING (true);

-- Create policy to allow users to view their own votes
CREATE POLICY "Users can view their own votes" ON poll_votes
  FOR SELECT USING (auth.uid()::text = user_id); 