-- Create apartments table for rental listings
CREATE TABLE IF NOT EXISTS apartments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    building_name TEXT NOT NULL,
    street_name TEXT NOT NULL,
    tower TEXT NOT NULL,
    apartment_number TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    apartment_type TEXT NOT NULL, -- 1BHK, 2BHK, 3BHK, etc.
    floor_number INTEGER,
    total_floors INTEGER,
    carpet_area DECIMAL(8,2), -- in sq ft
    built_up_area DECIMAL(8,2), -- in sq ft
    rent_amount DECIMAL(10,2) NOT NULL,
    security_deposit DECIMAL(10,2),
    maintenance_charges DECIMAL(8,2),
    available_from DATE,
    furnishing_status TEXT, -- Unfurnished, Semi-furnished, Fully-furnished
    parking_available BOOLEAN DEFAULT false,
    parking_type TEXT, -- 2-wheeler, 4-wheeler, both
    amenities TEXT[], -- Array of amenities
    pet_friendly BOOLEAN DEFAULT false,
    bachelor_allowed BOOLEAN DEFAULT true,
    preferred_tenant_type TEXT, -- Any, Family, Bachelor, Working Professional
    contact_name TEXT NOT NULL,
    contact_phone TEXT NOT NULL,
    contact_email TEXT,
    images TEXT[], -- Array of image URLs
    status TEXT DEFAULT 'active', -- active, rented, inactive
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_apartments_user_id ON apartments(user_id);
CREATE INDEX IF NOT EXISTS idx_apartments_city ON apartments(city);
CREATE INDEX IF NOT EXISTS idx_apartments_status ON apartments(status);
CREATE INDEX IF NOT EXISTS idx_apartments_rent_amount ON apartments(rent_amount);

-- Add RLS policies
ALTER TABLE apartments ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to read all active apartments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apartments' AND policyname = 'Anyone can view active apartments') THEN
        CREATE POLICY "Anyone can view active apartments" ON apartments
            FOR SELECT
            USING (status = 'active');
    END IF;
END $$;

-- Policy to allow users to read their own apartments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apartments' AND policyname = 'Users can view own apartments') THEN
        CREATE POLICY "Users can view own apartments" ON apartments
            FOR SELECT
            USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Policy to allow users to insert their own apartments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apartments' AND policyname = 'Users can insert own apartments') THEN
        CREATE POLICY "Users can insert own apartments" ON apartments
            FOR INSERT
            WITH CHECK (auth.uid()::text = user_id);
    END IF;
END $$;

-- Policy to allow users to update their own apartments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apartments' AND policyname = 'Users can update own apartments') THEN
        CREATE POLICY "Users can update own apartments" ON apartments
            FOR UPDATE
            USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Policy to allow users to delete their own apartments
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'apartments' AND policyname = 'Users can delete own apartments') THEN
        CREATE POLICY "Users can delete own apartments" ON apartments
            FOR DELETE
            USING (auth.uid()::text = user_id);
    END IF;
END $$;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_apartments_updated_at ON apartments;
CREATE TRIGGER update_apartments_updated_at 
    BEFORE UPDATE ON apartments 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 