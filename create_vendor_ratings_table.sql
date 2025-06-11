-- Create vendor_ratings table
CREATE TABLE IF NOT EXISTS public.vendor_ratings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    user_name TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    vendor_type TEXT NOT NULL, -- 'service' or 'delivery'
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS vendor_ratings_user_id_idx ON public.vendor_ratings(user_id);
CREATE INDEX IF NOT EXISTS vendor_ratings_vendor_id_idx ON public.vendor_ratings(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_ratings_vendor_type_idx ON public.vendor_ratings(vendor_type);
CREATE INDEX IF NOT EXISTS vendor_ratings_created_at_idx ON public.vendor_ratings(created_at);

-- Enable Row Level Security
ALTER TABLE public.vendor_ratings ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view all vendor ratings
CREATE POLICY "Users can view all vendor ratings"
    ON public.vendor_ratings
    FOR SELECT
    USING (true);

-- Create policy to allow users to insert their own ratings
CREATE POLICY "Users can insert their own ratings"
    ON public.vendor_ratings
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to update their own ratings
CREATE POLICY "Users can update their own ratings"
    ON public.vendor_ratings
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Create policy to allow users to delete their own ratings
CREATE POLICY "Users can delete their own ratings"
    ON public.vendor_ratings
    FOR DELETE
    USING (auth.uid()::text = user_id); 