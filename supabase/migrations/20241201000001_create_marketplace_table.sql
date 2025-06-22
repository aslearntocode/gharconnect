-- Create marketplace table
CREATE TABLE IF NOT EXISTS marketplace_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL,
    area TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category TEXT NOT NULL,
    condition TEXT NOT NULL,
    images TEXT[], -- Array of image URLs
    contact_phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    
    -- Foreign key to user_profiles
    CONSTRAINT fk_marketplace_user_profiles 
        FOREIGN KEY (user_id) 
        REFERENCES user_profiles(user_id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_marketplace_products_area ON marketplace_products(area);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_user_id ON marketplace_products(user_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_category ON marketplace_products(category);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_created_at ON marketplace_products(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_active ON marketplace_products(is_active);

-- Enable Row Level Security
ALTER TABLE marketplace_products ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view all active products
CREATE POLICY "Anyone can view active marketplace products" ON marketplace_products
    FOR SELECT
    USING (is_active = true);

-- Policy to allow users to insert their own products
CREATE POLICY "Users can insert own marketplace products" ON marketplace_products
    FOR INSERT
    WITH CHECK (auth.uid()::text = user_id);

-- Policy to allow users to update their own products
CREATE POLICY "Users can update own marketplace products" ON marketplace_products
    FOR UPDATE
    USING (auth.uid()::text = user_id);

-- Policy to allow users to delete their own products
CREATE POLICY "Users can delete own marketplace products" ON marketplace_products
    FOR DELETE
    USING (auth.uid()::text = user_id);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_marketplace_products_updated_at 
    BEFORE UPDATE ON marketplace_products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 