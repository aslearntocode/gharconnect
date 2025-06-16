-- Create vendor_availability table
CREATE TABLE IF NOT EXISTS public.vendor_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    vendor_id TEXT NOT NULL,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS vendor_availability_vendor_id_idx ON public.vendor_availability(vendor_id);
CREATE INDEX IF NOT EXISTS vendor_availability_date_idx ON public.vendor_availability(date);

-- Enable Row Level Security
ALTER TABLE public.vendor_availability ENABLE ROW LEVEL SECURITY;

-- Create policy to allow vendors to view their own availability
CREATE POLICY "Vendors can view their own availability"
    ON public.vendor_availability
    FOR SELECT
    USING (auth.uid()::text = vendor_id);

-- Create policy to allow vendors to insert their own availability
CREATE POLICY "Vendors can insert their own availability"
    ON public.vendor_availability
    FOR INSERT
    WITH CHECK (auth.uid()::text = vendor_id);

-- Create policy to allow vendors to update their own availability
CREATE POLICY "Vendors can update their own availability"
    ON public.vendor_availability
    FOR UPDATE
    USING (auth.uid()::text = vendor_id)
    WITH CHECK (auth.uid()::text = vendor_id);

-- Create policy to allow vendors to delete their own availability
CREATE POLICY "Vendors can delete their own availability"
    ON public.vendor_availability
    FOR DELETE
    USING (auth.uid()::text = vendor_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER update_vendor_availability_updated_at
    BEFORE UPDATE ON public.vendor_availability
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 