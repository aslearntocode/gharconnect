-- Modify vendor_permanent_availability table to allow inserts without authentication
-- Make vendor_id optional and add a policy for anonymous inserts

-- First, drop the existing unique constraint that requires vendor_id
ALTER TABLE vendor_permanent_availability 
DROP CONSTRAINT IF EXISTS vendor_permanent_availability_vendor_id_slot_type_key;

-- Make vendor_id nullable
ALTER TABLE vendor_permanent_availability 
ALTER COLUMN vendor_id DROP NOT NULL;

-- Add a new unique constraint that only applies when vendor_id is not null
-- Using a partial unique index instead of a constraint
CREATE UNIQUE INDEX vendor_permanent_availability_vendor_id_slot_type_key 
ON vendor_permanent_availability(vendor_id, slot_type) 
WHERE vendor_id IS NOT NULL;

-- Drop existing RLS policies
DROP POLICY IF EXISTS "Vendors can view own permanent availability" ON vendor_permanent_availability;
DROP POLICY IF EXISTS "Vendors can insert own permanent availability" ON vendor_permanent_availability;
DROP POLICY IF EXISTS "Vendors can update own permanent availability" ON vendor_permanent_availability;
DROP POLICY IF EXISTS "Vendors can delete own permanent availability" ON vendor_permanent_availability;

-- Create new policies that allow anonymous access
-- Allow anyone to view all records
CREATE POLICY "Anyone can view permanent availability" ON vendor_permanent_availability
    FOR SELECT USING (true);

-- Allow anyone to insert records (for anonymous registration)
CREATE POLICY "Anyone can insert permanent availability" ON vendor_permanent_availability
    FOR INSERT WITH CHECK (true);

-- Allow vendors to update their own records (if they have vendor_id)
CREATE POLICY "Vendors can update own permanent availability" ON vendor_permanent_availability
    FOR UPDATE USING (
        vendor_id IS NULL OR auth.uid()::text = vendor_id
    );

-- Allow vendors to delete their own records (if they have vendor_id)
CREATE POLICY "Vendors can delete own permanent availability" ON vendor_permanent_availability
    FOR DELETE USING (
        vendor_id IS NULL OR auth.uid()::text = vendor_id
    );

-- Add an index for better performance when vendor_id is null
CREATE INDEX IF NOT EXISTS idx_vendor_permanent_availability_vendor_id_null 
ON vendor_permanent_availability(vendor_id) WHERE vendor_id IS NULL; 