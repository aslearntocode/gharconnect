-- Update RLS Policies for user_profiles table
-- This migration safely updates existing policies with enhanced security

-- First, drop all existing policies to recreate them
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON user_profiles;

-- Now create the enhanced policies

-- 1. SELECT Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
    );

-- 2. INSERT Policy: Users can only insert their own profile
CREATE POLICY "Users can insert own profile" ON user_profiles
    FOR INSERT
    WITH CHECK (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
        AND user_id IS NOT NULL
        AND society_name IS NOT NULL
        AND building_name IS NOT NULL
        AND apartment_number IS NOT NULL
        AND email IS NOT NULL
    );

-- 3. UPDATE Policy: Users can only update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE
    USING (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
    )
    WITH CHECK (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
        AND user_id IS NOT NULL
        AND society_name IS NOT NULL
        AND building_name IS NOT NULL
        AND apartment_number IS NOT NULL
        AND email IS NOT NULL
    );

-- 4. DELETE Policy: Users can delete their own profile (optional)
CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE
    USING (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
    );

-- 5. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at_trigger ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at(); 