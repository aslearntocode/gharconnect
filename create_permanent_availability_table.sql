-- Create table for vendor permanent availability
CREATE TABLE vendor_permanent_availability (
    id SERIAL PRIMARY KEY,
    vendor_id TEXT NOT NULL,
    Name TEXT NOT NULL,
    Mobile_No TEXT NOT NULL,
    services TEXT NOT NULL,
    area TEXT NOT NULL,
    societies TEXT[] NOT NULL,
    slot_type TEXT NOT NULL CHECK (slot_type IN ('morning', 'afternoon', 'evening')),
    slot_start_time TEXT NOT NULL,
    slot_end_time TEXT NOT NULL,
    is_available BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vendor_id, slot_type)
);

-- Create index for better query performance
CREATE INDEX idx_vendor_permanent_availability_vendor_id ON vendor_permanent_availability(vendor_id);
CREATE INDEX idx_vendor_permanent_availability_area ON vendor_permanent_availability(area);
CREATE INDEX idx_vendor_permanent_availability_services ON vendor_permanent_availability(services);

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_vendor_permanent_availability_updated_at 
    BEFORE UPDATE ON vendor_permanent_availability 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE vendor_permanent_availability ENABLE ROW LEVEL SECURITY;

-- Example policy to allow vendors to see only their own data
CREATE POLICY "Vendors can view own permanent availability" ON vendor_permanent_availability
    FOR SELECT USING (auth.uid()::text = vendor_id);

-- Example policy to allow vendors to insert their own data
CREATE POLICY "Vendors can insert own permanent availability" ON vendor_permanent_availability
    FOR INSERT WITH CHECK (auth.uid()::text = vendor_id);

-- Example policy to allow vendors to update their own data
CREATE POLICY "Vendors can update own permanent availability" ON vendor_permanent_availability
    FOR UPDATE USING (auth.uid()::text = vendor_id);

-- Example policy to allow vendors to delete their own data
CREATE POLICY "Vendors can delete own permanent availability" ON vendor_permanent_availability
    FOR DELETE USING (auth.uid()::text = vendor_id); 