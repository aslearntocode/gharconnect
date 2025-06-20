-- Add missing apartment_number column to apartments table
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS apartment_number TEXT;

-- Make it NOT NULL if you want to enforce it for new records
-- ALTER TABLE apartments ALTER COLUMN apartment_number SET NOT NULL;

-- Update existing records if needed (optional)
-- UPDATE apartments SET apartment_number = 'N/A' WHERE apartment_number IS NULL;

-- Add missing columns to apartments table
-- This script adds all the columns that the apartment form is trying to use

-- Basic information columns
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS building_name TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS street_name TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS tower TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS city TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS state TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS pincode TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS apartment_type TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS floor_number INTEGER;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS total_floors INTEGER;

-- Area and pricing columns
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS carpet_area DECIMAL(8,2);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS rent_amount DECIMAL(10,2);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(10,2);
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS available_from DATE;

-- Furnishing and parking columns
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS furnishing_status TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS parking_type TEXT;

-- Amenities and preferences columns
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS amenities TEXT[];
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT false;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS bachelor_allowed BOOLEAN DEFAULT true;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS preferred_tenant_type TEXT;

-- Contact information columns
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS contact_name TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS contact_phone TEXT;
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Images column
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS images TEXT[];

-- Status and timestamps (if not already present)
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());
ALTER TABLE apartments ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW());

-- Add indexes for better performance (if not already present)
CREATE INDEX IF NOT EXISTS idx_apartments_user_id ON apartments(user_id);
CREATE INDEX IF NOT EXISTS idx_apartments_city ON apartments(city);
CREATE INDEX IF NOT EXISTS idx_apartments_status ON apartments(status);
CREATE INDEX IF NOT EXISTS idx_apartments_rent_amount ON apartments(rent_amount);

-- This script fully synchronizes the 'apartments' table with the application form.

-- Step 1: Drop old, unused, or problematic columns.
-- The 'address' column was causing a 'not-null' constraint error.
ALTER TABLE apartments
DROP COLUMN IF EXISTS address,
DROP COLUMN IF EXISTS total_floors,
DROP COLUMN IF EXISTS built_up_area,
DROP COLUMN IF EXISTS maintenance_charges;

-- Step 2: Add all columns required by the form if they don't already exist.
-- This ensures any missing columns from previous failed migrations are created.

-- Basic information columns
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS building_name TEXT,
ADD COLUMN IF NOT EXISTS street_name TEXT,
ADD COLUMN IF NOT EXISTS tower TEXT,
ADD COLUMN IF NOT EXISTS apartment_number TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS state TEXT,
ADD COLUMN IF NOT EXISTS pincode TEXT,
ADD COLUMN IF NOT EXISTS apartment_type TEXT,
ADD COLUMN IF NOT EXISTS floor_number INTEGER;

-- Area and pricing columns
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS carpet_area DECIMAL(8,2),
ADD COLUMN IF NOT EXISTS rent_amount DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS security_deposit DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS available_from DATE;

-- Furnishing and parking columns
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS furnishing_status TEXT,
ADD COLUMN IF NOT EXISTS parking_available BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS parking_type TEXT;

-- Amenities and preferences columns
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS amenities TEXT[],
ADD COLUMN IF NOT EXISTS pet_friendly BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS bachelor_allowed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS preferred_tenant_type TEXT;

-- Contact information columns
ALTER TABLE apartments 
ADD COLUMN IF NOT EXISTS contact_name TEXT,
ADD COLUMN IF NOT EXISTS contact_phone TEXT,
ADD COLUMN IF NOT EXISTS contact_email TEXT;

-- Images column
ALTER TABLE apartments
ADD COLUMN IF NOT EXISTS images TEXT[];

-- Step 3: Ensure data types and constraints match the schema.
-- (This is mostly for reference, as ADD COLUMN IF NOT EXISTS handles it, but it's good practice to verify)
-- Example: Make columns NOT NULL if they are required by the form.
-- ALTER TABLE apartments ALTER COLUMN building_name SET NOT NULL;
-- ALTER TABLE apartments ALTER COLUMN street_name SET NOT NULL;
-- ... and so on for other required fields.

-- Final check on indexes for performance.
CREATE INDEX IF NOT EXISTS idx_apartments_user_id ON apartments(user_id);
CREATE INDEX IF NOT EXISTS idx_apartments_city ON apartments(city);
CREATE INDEX IF NOT EXISTS idx_apartments_status ON apartments(status);
CREATE INDEX IF NOT EXISTS idx_apartments_rent_amount ON apartments(rent_amount); 