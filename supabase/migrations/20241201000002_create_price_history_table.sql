-- Create price history table for marketplace products
CREATE TABLE IF NOT EXISTS marketplace_price_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    product_id UUID NOT NULL,
    old_price DECIMAL(10,2),
    new_price DECIMAL(10,2) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    
    -- Foreign key to marketplace_products
    CONSTRAINT fk_price_history_product 
        FOREIGN KEY (product_id) 
        REFERENCES marketplace_products(id) 
        ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_price_history_product_id ON marketplace_price_history(product_id);
CREATE INDEX IF NOT EXISTS idx_price_history_changed_at ON marketplace_price_history(changed_at DESC);

-- Enable Row Level Security
ALTER TABLE marketplace_price_history ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to view price history for active products
CREATE POLICY "Anyone can view price history for active products" ON marketplace_price_history
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM marketplace_products 
            WHERE marketplace_products.id = marketplace_price_history.product_id 
            AND marketplace_products.is_active = true
        )
    );

-- Policy to allow users to insert price history for their own products
CREATE POLICY "Users can insert price history for own products" ON marketplace_price_history
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM marketplace_products 
            WHERE marketplace_products.id = marketplace_price_history.product_id 
            AND marketplace_products.user_id = auth.uid()::text
        )
    );

-- Create a function to automatically insert price history when price changes
CREATE OR REPLACE FUNCTION insert_price_history()
RETURNS TRIGGER AS $$
BEGIN
    -- Only insert if price actually changed
    IF OLD.price IS DISTINCT FROM NEW.price THEN
        INSERT INTO marketplace_price_history (product_id, old_price, new_price)
        VALUES (NEW.id, OLD.price, NEW.price);
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically track price changes
CREATE TRIGGER track_price_changes 
    AFTER UPDATE ON marketplace_products 
    FOR EACH ROW 
    EXECUTE FUNCTION insert_price_history(); 