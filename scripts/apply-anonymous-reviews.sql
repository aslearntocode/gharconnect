-- Script to allow anonymous reviews without authentication
-- Run this in the Supabase SQL Editor

-- Drop existing policies for reviews table
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create new policies that allow anonymous reviews
-- Allow anyone to view all reviews
CREATE POLICY "Anyone can view all reviews"
    ON public.reviews
    FOR SELECT
    USING (true);

-- Allow anyone to insert reviews (anonymous users)
CREATE POLICY "Anyone can insert reviews"
    ON public.reviews
    FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own reviews (if they have the user_id)
CREATE POLICY "Users can update their own reviews"
    ON public.reviews
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%')
    WITH CHECK (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%');

-- Allow users to delete their own reviews (if they have the user_id)
CREATE POLICY "Users can delete their own reviews"
    ON public.reviews
    FOR DELETE
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%');

-- Drop existing policies for property_reviews table if it exists
DROP POLICY IF EXISTS "Users can view their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can insert their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can update their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can delete their own property reviews" ON public.property_reviews;

-- Create new policies for property_reviews table
-- Allow anyone to view all property reviews
CREATE POLICY "Anyone can view all property reviews"
    ON public.property_reviews
    FOR SELECT
    USING (true);

-- Allow anyone to insert property reviews (anonymous users)
CREATE POLICY "Anyone can insert property reviews"
    ON public.property_reviews
    FOR INSERT
    WITH CHECK (true);

-- Allow users to update their own property reviews (if they have the user_id)
CREATE POLICY "Users can update their own property reviews"
    ON public.property_reviews
    FOR UPDATE
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%')
    WITH CHECK (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%');

-- Allow users to delete their own property reviews (if they have the user_id)
CREATE POLICY "Users can delete their own property reviews"
    ON public.property_reviews
    FOR DELETE
    USING (auth.uid()::text = user_id OR user_id LIKE 'anonymous_%'); 