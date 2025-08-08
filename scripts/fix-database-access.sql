-- Comprehensive fix for database access issues
-- Run this in the Supabase SQL Editor to allow public access to all necessary tables

-- ============================================================================
-- APARTMENTS TABLE POLICIES
-- ============================================================================

-- Drop existing policies for apartments table
DROP POLICY IF EXISTS "Users can view all active apartments" ON public.apartments;
DROP POLICY IF EXISTS "Users can insert their own apartments" ON public.apartments;
DROP POLICY IF EXISTS "Users can update their own apartments" ON public.apartments;
DROP POLICY IF EXISTS "Users can delete their own apartments" ON public.apartments;

-- Create new policies for apartments table
-- Allow anyone to view all apartments (public read access)
CREATE POLICY "Anyone can view all apartments"
    ON public.apartments
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert apartments
CREATE POLICY "Authenticated users can insert apartments"
    ON public.apartments
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own apartments
CREATE POLICY "Users can update their own apartments"
    ON public.apartments
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own apartments
CREATE POLICY "Users can delete their own apartments"
    ON public.apartments
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- ============================================================================
-- REVIEWS TABLE POLICIES
-- ============================================================================

-- Drop existing policies for reviews table
DROP POLICY IF EXISTS "Users can view their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can view all reviews" ON public.reviews;
DROP POLICY IF EXISTS "Anyone can insert reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can update their own reviews" ON public.reviews;
DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.reviews;

-- Create new policies for reviews table
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

-- ============================================================================
-- PROPERTY_REVIEWS TABLE POLICIES
-- ============================================================================

-- Drop existing policies for property_reviews table
DROP POLICY IF EXISTS "Users can view their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can insert their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can update their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Users can delete their own property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Anyone can view all property reviews" ON public.property_reviews;
DROP POLICY IF EXISTS "Anyone can insert property reviews" ON public.property_reviews;
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

-- ============================================================================
-- POSTS TABLE POLICIES (for social features)
-- ============================================================================

-- Drop existing policies for posts table if they exist
DROP POLICY IF EXISTS "Users can view all posts" ON public.posts;
DROP POLICY IF EXISTS "Users can insert their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
DROP POLICY IF EXISTS "Users can delete their own posts" ON public.posts;

-- Create new policies for posts table
-- Allow anyone to view all posts
CREATE POLICY "Anyone can view all posts"
    ON public.posts
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert posts
CREATE POLICY "Authenticated users can insert posts"
    ON public.posts
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own posts
CREATE POLICY "Users can update their own posts"
    ON public.posts
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own posts
CREATE POLICY "Users can delete their own posts"
    ON public.posts
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- ============================================================================
-- COMMENTS TABLE POLICIES (for social features)
-- ============================================================================

-- Drop existing policies for comments table if they exist
DROP POLICY IF EXISTS "Users can view all comments" ON public.comments;
DROP POLICY IF EXISTS "Users can insert their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.comments;
DROP POLICY IF EXISTS "Users can delete their own comments" ON public.comments;

-- Create new policies for comments table
-- Allow anyone to view all comments
CREATE POLICY "Anyone can view all comments"
    ON public.comments
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert comments
CREATE POLICY "Authenticated users can insert comments"
    ON public.comments
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own comments
CREATE POLICY "Users can update their own comments"
    ON public.comments
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own comments
CREATE POLICY "Users can delete their own comments"
    ON public.comments
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- ============================================================================
-- USER_PROFILES TABLE POLICIES
-- ============================================================================

-- Drop existing policies for user_profiles table if they exist
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.user_profiles;

-- Create new policies for user_profiles table
-- Allow users to view their own profile
CREATE POLICY "Users can view their own profile"
    ON public.user_profiles
    FOR SELECT
    USING (auth.uid()::text = user_id);

-- Allow users to insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.user_profiles
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.user_profiles
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own profile
CREATE POLICY "Users can delete their own profile"
    ON public.user_profiles
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- ============================================================================
-- VENDOR_AVAILABILITY TABLE POLICIES
-- ============================================================================

-- Drop existing policies for vendor_availability table if they exist
DROP POLICY IF EXISTS "Users can view all vendor availability" ON public.vendor_availability;
DROP POLICY IF EXISTS "Users can insert their own availability" ON public.vendor_availability;
DROP POLICY IF EXISTS "Users can update their own availability" ON public.vendor_availability;
DROP POLICY IF EXISTS "Users can delete their own availability" ON public.vendor_availability;

-- Create new policies for vendor_availability table
-- Allow anyone to view all vendor availability
CREATE POLICY "Anyone can view all vendor availability"
    ON public.vendor_availability
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert availability
CREATE POLICY "Authenticated users can insert availability"
    ON public.vendor_availability
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to update their own availability
CREATE POLICY "Users can update their own availability"
    ON public.vendor_availability
    FOR UPDATE
    USING (auth.uid()::text = user_id)
    WITH CHECK (auth.uid()::text = user_id);

-- Allow users to delete their own availability
CREATE POLICY "Users can delete their own availability"
    ON public.vendor_availability
    FOR DELETE
    USING (auth.uid()::text = user_id); 