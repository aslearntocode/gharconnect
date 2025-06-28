-- Add verification status to vendor_permanent_availability table
ALTER TABLE vendor_permanent_availability 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Add verification status to vendor_weekly_availability table
ALTER TABLE vendor_weekly_availability 
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false;

-- Create admin_verification_log table to track verification changes
CREATE TABLE IF NOT EXISTS admin_verification_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    admin_id TEXT NOT NULL,
    admin_email TEXT NOT NULL,
    vendor_id TEXT NOT NULL,
    vendor_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('verify', 'unverify')),
    table_name TEXT NOT NULL CHECK (table_name IN ('vendor_permanent_availability', 'vendor_weekly_availability')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_admin_verification_log_vendor_id ON admin_verification_log(vendor_id);
CREATE INDEX IF NOT EXISTS idx_admin_verification_log_admin_id ON admin_verification_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_verification_log_created_at ON admin_verification_log(created_at DESC);

-- Enable RLS on admin_verification_log
ALTER TABLE admin_verification_log ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view verification logs
CREATE POLICY "Admins can view verification logs" ON admin_verification_log
    FOR SELECT USING (true);

-- Policy to allow admins to insert verification logs
CREATE POLICY "Admins can insert verification logs" ON admin_verification_log
    FOR INSERT WITH CHECK (true);

-- Create admin_users table to manage admin access
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for admin_users
CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Enable RLS on admin_users
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy to allow admins to view admin users
CREATE POLICY "Admins can view admin users" ON admin_users
    FOR SELECT USING (true);

-- Policy to allow super admins to manage admin users
CREATE POLICY "Super admins can manage admin users" ON admin_users
    FOR ALL USING (auth.uid()::text IN (
        SELECT user_id FROM admin_users WHERE role = 'super_admin'
    ));

-- Insert a default super admin (you'll need to replace with actual admin user ID)
-- INSERT INTO admin_users (user_id, email, name, role) VALUES ('your-admin-uid', 'admin@gharconnect.com', 'Admin', 'super_admin');

-- Create function to update verification status
CREATE OR REPLACE FUNCTION update_vendor_verification(
    p_vendor_id TEXT,
    p_table_name TEXT,
    p_is_verified BOOLEAN,
    p_admin_id TEXT,
    p_admin_email TEXT,
    p_vendor_name TEXT
)
RETURNS VOID AS $$
BEGIN
    -- Update verification status in the specified table
    IF p_table_name = 'vendor_permanent_availability' THEN
        UPDATE vendor_permanent_availability 
        SET is_verified = p_is_verified 
        WHERE vendor_id = p_vendor_id;
    ELSIF p_table_name = 'vendor_weekly_availability' THEN
        UPDATE vendor_weekly_availability 
        SET is_verified = p_is_verified 
        WHERE vendor_id = p_vendor_id;
    END IF;
    
    -- Log the verification action
    INSERT INTO admin_verification_log (
        admin_id, 
        admin_email, 
        vendor_id, 
        vendor_name, 
        action, 
        table_name
    ) VALUES (
        p_admin_id,
        p_admin_email,
        p_vendor_id,
        p_vendor_name,
        CASE WHEN p_is_verified THEN 'verify' ELSE 'unverify' END,
        p_table_name
    );
END;
$$ LANGUAGE plpgsql; 