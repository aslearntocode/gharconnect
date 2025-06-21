-- Create rental_applications table
CREATE TABLE IF NOT EXISTS public.rental_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    apartment_id UUID NOT NULL REFERENCES public.apartments(id) ON DELETE CASCADE,
    landlord_user_id TEXT NOT NULL,
    applicant_user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_no TEXT NOT NULL,
    family_members INTEGER NOT NULL,
    has_pets BOOLEAN NOT NULL,
    employment_status TEXT NOT NULL,
    current_city TEXT NOT NULL,
    current_state TEXT NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, contacted
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS rental_applications_apartment_id_idx ON public.rental_applications(apartment_id);
CREATE INDEX IF NOT EXISTS rental_applications_landlord_user_id_idx ON public.rental_applications(landlord_user_id);
CREATE INDEX IF NOT EXISTS rental_applications_applicant_user_id_idx ON public.rental_applications(applicant_user_id);
CREATE INDEX IF NOT EXISTS rental_applications_status_idx ON public.rental_applications(status);
CREATE INDEX IF NOT EXISTS rental_applications_created_at_idx ON public.rental_applications(created_at);

-- Enable Row Level Security
ALTER TABLE public.rental_applications ENABLE ROW LEVEL SECURITY;

-- Create policy to allow landlords to view applications for their properties
CREATE POLICY "Landlords can view applications for their properties"
    ON public.rental_applications
    FOR SELECT
    USING (auth.uid()::text = landlord_user_id);

-- Create policy to allow applicants to view their own applications
CREATE POLICY "Applicants can view their own applications"
    ON public.rental_applications
    FOR SELECT
    USING (auth.uid()::text = applicant_user_id);

-- Create policy to allow authenticated users to insert applications
CREATE POLICY "Authenticated users can insert applications"
    ON public.rental_applications
    FOR INSERT
    WITH CHECK (auth.uid()::text = applicant_user_id);

-- Create policy to allow landlords to update applications for their properties
CREATE POLICY "Landlords can update applications for their properties"
    ON public.rental_applications
    FOR UPDATE
    USING (auth.uid()::text = landlord_user_id)
    WITH CHECK (auth.uid()::text = landlord_user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_rental_applications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at timestamp
DROP TRIGGER IF EXISTS update_rental_applications_updated_at ON public.rental_applications;
CREATE TRIGGER update_rental_applications_updated_at 
    BEFORE UPDATE ON public.rental_applications 
    FOR EACH ROW 
    EXECUTE FUNCTION update_rental_applications_updated_at(); 