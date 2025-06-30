-- Create polls table for storing poll details
CREATE TABLE IF NOT EXISTS polls (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  options JSONB NOT NULL, -- Array of poll options with id, text, votes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  location TEXT -- To identify polls for specific locations like 'parel'
);

-- Create poll_votes table for storing user poll responses
CREATE TABLE IF NOT EXISTS poll_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  poll_id TEXT NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  option_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(poll_id, user_id) -- Ensure one vote per user per poll
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_polls_location ON polls(location);
CREATE INDEX IF NOT EXISTS idx_polls_active ON polls(is_active);
CREATE INDEX IF NOT EXISTS idx_poll_votes_poll_id ON poll_votes(poll_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_user_id ON poll_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_poll_votes_option_id ON poll_votes(option_id);

-- Enable Row Level Security (RLS)
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Anyone can view active polls" ON polls;
DROP POLICY IF EXISTS "Users can insert their own votes" ON poll_votes;
DROP POLICY IF EXISTS "Users can view all votes" ON poll_votes;
DROP POLICY IF EXISTS "Users can view their own votes" ON poll_votes;

-- Create policies for polls table
CREATE POLICY "Anyone can view active polls" ON polls
  FOR SELECT USING (is_active = true);

-- Create policies for poll_votes table
CREATE POLICY "Users can insert their own votes" ON poll_votes
  FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can view all votes" ON poll_votes
  FOR SELECT USING (true);

CREATE POLICY "Users can view their own votes" ON poll_votes
  FOR SELECT USING (auth.uid()::text = user_id);

-- Insert sample poll data for Parel
INSERT INTO polls (id, question, options, location) VALUES (
  'parel-community-poll-1',
  'What is the main pain point in your area?',
  '[
    {"id": "option1", "text": "Bad Walkability", "votes": 0},
    {"id": "option2", "text": "Bad Connectivity", "votes": 0},
    {"id": "option3", "text": "Bad Security", "votes": 0},
    {"id": "option4", "text": "Taxi Parking On Road", "votes": 0},
    {"id": "option5", "text": "Noise Levels post 9pm", "votes": 0},
    {"id": "option6", "text": "Fewer Eating Places", "votes": 0}
  ]'::jsonb,
  'parel'
) ON CONFLICT (id) DO UPDATE SET
  question = EXCLUDED.question,
  options = EXCLUDED.options,
  updated_at = NOW(); 