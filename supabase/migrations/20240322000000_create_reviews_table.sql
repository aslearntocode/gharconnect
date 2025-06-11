-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.reviews;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop existing table and all its dependencies
DROP TABLE IF EXISTS public.reviews CASCADE;

-- Create reviews table
CREATE TABLE public.reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    card_id TEXT NOT NULL,
    card_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX reviews_user_id_idx ON public.reviews(user_id);
CREATE INDEX reviews_card_id_idx ON public.reviews(card_id);
CREATE INDEX reviews_created_at_idx ON public.reviews(created_at);

-- Enable Row Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own reviews
CREATE POLICY "Users can view their own reviews"
    ON public.reviews
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Create policy to allow users to insert their own reviews
CREATE POLICY "Users can insert their own reviews"
    ON public.reviews
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own reviews
CREATE POLICY "Users can update their own reviews"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own reviews
CREATE POLICY "Users can delete their own reviews"
    ON public.reviews
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.reviews
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comments to table and columns
COMMENT ON TABLE public.reviews IS 'Stores user reviews for credit cards';
COMMENT ON COLUMN public.reviews.id IS 'Unique identifier for the review';
COMMENT ON COLUMN public.reviews.user_id IS 'Firebase user ID of the reviewer';
COMMENT ON COLUMN public.reviews.user_name IS 'Name of the reviewer';
COMMENT ON COLUMN public.reviews.card_id IS 'ID of the credit card being reviewed';
COMMENT ON COLUMN public.reviews.card_name IS 'Name of the credit card being reviewed';
COMMENT ON COLUMN public.reviews.rating IS 'Rating given by the user (1-10)';
COMMENT ON COLUMN public.reviews.comment IS 'Review comment from the user';
COMMENT ON COLUMN public.reviews.created_at IS 'Timestamp when the review was created';
COMMENT ON COLUMN public.reviews.updated_at IS 'Timestamp when the review was last updated'; 