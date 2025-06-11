-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can insert their own complaints" ON public.complaints;
DROP POLICY IF EXISTS "Users can update their own complaints" ON public.complaints;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS set_updated_at ON public.complaints;

-- Drop existing function if it exists
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop existing table and all its dependencies
DROP TABLE IF EXISTS public.complaints CASCADE;

-- Create complaints table
CREATE TABLE public.complaints (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    product TEXT NOT NULL,
    issuer TEXT NOT NULL,
    complaint TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX complaints_user_id_idx ON public.complaints(user_id);

-- Create index on status for filtering
CREATE INDEX complaints_status_idx ON public.complaints(status);

-- Enable Row Level Security
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view their own complaints
CREATE POLICY "Users can view their own complaints"
    ON public.complaints
    FOR SELECT
    USING (true);  -- Allow all authenticated users to view complaints

-- Create policy to allow users to insert their own complaints
CREATE POLICY "Users can insert their own complaints"
    ON public.complaints
    FOR INSERT
    WITH CHECK (true);  -- Allow all authenticated users to insert complaints

-- Create policy to allow users to update their own complaints
CREATE POLICY "Users can update their own complaints"
    ON public.complaints
    FOR UPDATE
    USING (true)  -- Allow all authenticated users to update complaints
    WITH CHECK (true);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at timestamp
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Add comment to table
COMMENT ON TABLE public.complaints IS 'Stores user complaints about financial products';

-- Add comments to columns
COMMENT ON COLUMN public.complaints.id IS 'Unique identifier for the complaint';
COMMENT ON COLUMN public.complaints.user_id IS 'Firebase user ID';
COMMENT ON COLUMN public.complaints.name IS 'Name of the user submitting the complaint';
COMMENT ON COLUMN public.complaints.email IS 'Email of the user submitting the complaint';
COMMENT ON COLUMN public.complaints.phone IS 'Phone number of the user';
COMMENT ON COLUMN public.complaints.product IS 'Type of financial product (credit-card, personal-loan, etc.)';
COMMENT ON COLUMN public.complaints.issuer IS 'Name of the financial institution';
COMMENT ON COLUMN public.complaints.complaint IS 'Detailed description of the complaint';
COMMENT ON COLUMN public.complaints.status IS 'Current status of the complaint (pending, in-progress, resolved)';
COMMENT ON COLUMN public.complaints.created_at IS 'Timestamp when the complaint was created';
COMMENT ON COLUMN public.complaints.updated_at IS 'Timestamp when the complaint was last updated'; 