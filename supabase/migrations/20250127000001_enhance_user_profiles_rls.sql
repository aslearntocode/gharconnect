-- Enhanced RLS Policies for user_profiles table
-- This migration improves security and functionality

-- First, drop existing policies to recreate them with better security
DROP POLICY IF EXISTS "Users can view own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON user_profiles;

-- Enhanced RLS Policies

-- 1. SELECT Policy: Users can only view their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT
    USING (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
    );

-- 2. INSERT Policy: Users can only insert their own profile with proper validation
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

-- 3. UPDATE Policy: Users can only update their own profile with restrictions
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

-- 4. DELETE Policy: Users can delete their own profile (optional - remove if you want to prevent deletion)
CREATE POLICY "Users can delete own profile" ON user_profiles
    FOR DELETE
    USING (
        auth.uid()::text = user_id 
        AND auth.role() = 'authenticated'
    );

-- 5. Additional security: Prevent users from changing their user_id
-- This is handled by the WITH CHECK clause in UPDATE policy

-- 6. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_user_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 7. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_user_profiles_updated_at_trigger ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at_trigger
    BEFORE UPDATE ON user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_user_profiles_updated_at();

-- 8. Create a function to validate email format (optional)
CREATE OR REPLACE FUNCTION validate_email_format(email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
    -- Basic email validation regex
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql;

-- 9. Add a check constraint for email format (optional)
ALTER TABLE user_profiles 
ADD CONSTRAINT check_email_format 
CHECK (validate_email_format(email));

-- 10. Add a check constraint to ensure phone number is not empty if provided
ALTER TABLE user_profiles 
ADD CONSTRAINT check_phone_not_empty 
CHECK (phone IS NULL OR LENGTH(TRIM(phone)) > 0);

-- 11. Add a check constraint to ensure all required fields are not empty
ALTER TABLE user_profiles 
ADD CONSTRAINT check_required_fields_not_empty 
CHECK (
    LENGTH(TRIM(society_name)) > 0 
    AND LENGTH(TRIM(building_name)) > 0 
    AND LENGTH(TRIM(apartment_number)) > 0 
    AND LENGTH(TRIM(email)) > 0
);

-- 12. Create an index for better performance on authentication queries
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_lookup 
ON user_profiles(user_id) 
WHERE user_id IS NOT NULL;

-- 13. Add a comment to document the security model
COMMENT ON TABLE user_profiles IS 'User profile information with RLS enabled. Users can only access their own profile data.';
COMMENT ON COLUMN user_profiles.user_id IS 'Firebase user ID - must match auth.uid() for access';
COMMENT ON COLUMN user_profiles.email IS 'User email - must be valid format and not empty'; 