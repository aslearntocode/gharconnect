-- Fix RLS Policies for user_profiles table to work with Firebase Authentication
-- The issue is that the app uses Firebase Auth but RLS policies check for Supabase auth.uid()

-- First, drop all existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Since we're using Firebase Auth, we need to disable RLS for now
-- and handle security at the application level
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;

-- Alternative approach: If you want to keep RLS enabled, you need to pass the user_id
-- in the request context. Here's how to do that:

-- 1. Create a function to get the current user ID from request headers
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS TEXT AS $$
BEGIN
    -- This function will be called by RLS policies
    -- For Firebase Auth, we need to get the user_id from the request context
    -- This is a simplified approach - you'll need to set this in your app
    RETURN current_setting('request.jwt.claims', true)::json->>'user_id';
EXCEPTION
    WHEN OTHERS THEN
        RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 2. Re-enable RLS with Firebase-compatible policies
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create policies that work with Firebase Auth
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (
        user_id = get_current_user_id()
        OR user_id = current_setting('request.jwt.claims', true)::json->>'user_id'
    );

CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT
    WITH CHECK (
        user_id = get_current_user_id()
        AND user_id IS NOT NULL
        AND society_name IS NOT NULL
        AND building_name IS NOT NULL
        AND apartment_number IS NOT NULL
        AND email IS NOT NULL
    );

CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (
        user_id = get_current_user_id()
    )
    WITH CHECK (
        user_id = get_current_user_id()
        AND user_id IS NOT NULL
        AND society_name IS NOT NULL
        AND building_name IS NOT NULL
        AND apartment_number IS NOT NULL
        AND email IS NOT NULL
    );

CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE
    USING (
        user_id = get_current_user_id()
    );

-- 4. Create trigger to automatically update updated_at
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_user_profiles_updated_at_trigger ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at(); 