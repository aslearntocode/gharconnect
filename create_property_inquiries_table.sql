-- Create property_inquiries table to store user inquiries for property details
CREATE TABLE IF NOT EXISTS property_inquiries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id UUID REFERENCES apartments(id) ON DELETE CASCADE,
    user_mobile VARCHAR(15) NOT NULL,
    user_email VARCHAR(255),
    inquiry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    owner_contact_phone VARCHAR(15),
    owner_name VARCHAR(255),
    owner_email VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_property_inquiries_apartment_id ON property_inquiries(apartment_id);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_user_mobile ON property_inquiries(user_mobile);
CREATE INDEX IF NOT EXISTS idx_property_inquiries_created_at ON property_inquiries(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE property_inquiries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert inquiries
CREATE POLICY "Allow authenticated users to insert inquiries" ON property_inquiries
    FOR INSERT WITH CHECK (true);

-- Create policy to allow users to view their own inquiries
CREATE POLICY "Allow users to view their own inquiries" ON property_inquiries
    FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_property_inquiries_updated_at 
    BEFORE UPDATE ON property_inquiries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 