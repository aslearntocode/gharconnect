-- Create talents table
CREATE TABLE IF NOT EXISTS talents (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id TEXT NOT NULL, -- Firebase user ID
    society VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    main_image TEXT,
    images TEXT[] DEFAULT '{}',
    contact JSONB NOT NULL DEFAULT '{}',
    rating DECIMAL(3,2) DEFAULT 0.00,
    review_count INTEGER DEFAULT 0,
    experience VARCHAR(100),
    pricing VARCHAR(100),
    availability VARCHAR(100),
    skills TEXT[] DEFAULT '{}',
    about TEXT,
    portfolio TEXT[] DEFAULT '{}',
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_talents_society ON talents(society);
CREATE INDEX IF NOT EXISTS idx_talents_category ON talents(category);
CREATE INDEX IF NOT EXISTS idx_talents_active ON talents(is_active);
CREATE INDEX IF NOT EXISTS idx_talents_user_id ON talents(user_id);

-- Create RLS policies
ALTER TABLE talents ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active talents
CREATE POLICY "Allow public read access to active talents" ON talents
    FOR SELECT USING (is_active = true);

-- Allow authenticated users to insert their own talents
CREATE POLICY "Allow authenticated users to insert talents" ON talents
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own talents
CREATE POLICY "Allow users to update their own talents" ON talents
    FOR UPDATE USING (user_id = auth.uid()::text);

-- Allow users to delete their own talents
CREATE POLICY "Allow users to delete their own talents" ON talents
    FOR DELETE USING (user_id = auth.uid()::text);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_talents_updated_at 
    BEFORE UPDATE ON talents 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for different societies
INSERT INTO talents (society, name, category, description, main_image, images, contact, rating, review_count, experience, pricing, availability, skills, about, portfolio) VALUES
-- Parel talents
('parel', 'Priya Sharma', 'music', 'Professional classical vocalist with 8+ years of experience. Specializes in Hindustani classical music and Bollywood songs.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43210", "email": "priya.sharma@email.com", "location": "Parel, Mumbai"}', 4.8, 24, '8+ years', '₹2000/session', 'Weekends & Evenings', ARRAY['Hindustani Classical', 'Bollywood Songs', 'Bhajans', 'Wedding Performances', 'Music Teaching'], 'I am a passionate classical vocalist with over 8 years of experience in performing and teaching music.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300']),

('parel', 'Rahul Patel', 'photography', 'Wedding and event photographer capturing beautiful moments. Specializes in candid photography and traditional ceremonies.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43211", "email": "rahul.patel@email.com", "location": "Parel, Mumbai"}', 4.9, 31, '5+ years', '₹15,000/day', 'All days', ARRAY['Wedding Photography', 'Event Photography', 'Candid Photography', 'Portrait Photography', 'Photo Editing'], 'I am a professional photographer with 5+ years of experience specializing in wedding and event photography.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300']),

-- Worli talents
('worli', 'Anjali Desai', 'writing', 'Content writer and copywriter specializing in marketing content, blog posts, and social media content.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43212", "email": "anjali.desai@email.com", "location": "Worli, Mumbai"}', 4.7, 18, '6+ years', '₹500/article', 'Weekdays', ARRAY['Content Writing', 'Copywriting', 'Blog Writing', 'Social Media Content', 'SEO Writing'], 'I am a content writer and copywriter with 6+ years of experience in creating engaging content.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300']),

('worli', 'Vikram Singh', 'tech', 'Full-stack developer specializing in React, Node.js, and mobile app development. Available for freelance projects.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43213", "email": "vikram.singh@email.com", "location": "Worli, Mumbai"}', 4.9, 42, '7+ years', '₹2000/hour', 'Flexible', ARRAY['React', 'Node.js', 'Mobile Development', 'Full-stack Development', 'API Development'], 'I am a full-stack developer with 7+ years of experience in web and mobile app development.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300']),

-- Bandra talents
('bandra', 'Meera Iyer', 'design', 'Graphic designer and illustrator creating beautiful logos, branding materials, and digital art.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43214", "email": "meera.iyer@email.com", "location": "Bandra West, Mumbai"}', 4.8, 27, '4+ years', '₹3000/design', 'Weekdays & Weekends', ARRAY['Graphic Design', 'Logo Design', 'Branding', 'Digital Art', 'Illustration'], 'I am a graphic designer and illustrator with 4+ years of experience in creating beautiful visual designs.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300', '/api/placeholder/400/300']),

('bandra', 'Arjun Reddy', 'education', 'Math and Science tutor for CBSE and ICSE students. Specializes in making complex topics easy to understand.', '/api/placeholder/400/300', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300'], '{"phone": "+91 98765 43215", "email": "arjun.reddy@email.com", "location": "Bandra West, Mumbai"}', 4.9, 35, '10+ years', '₹800/hour', 'Evenings & Weekends', ARRAY['Mathematics', 'Physics', 'Chemistry', 'CBSE', 'ICSE', 'Online Tutoring'], 'I am a math and science tutor with 10+ years of experience in teaching CBSE and ICSE students.', ARRAY['/api/placeholder/400/300', '/api/placeholder/400/300']);

-- Create talent reviews table
CREATE TABLE IF NOT EXISTS talent_reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    talent_id UUID REFERENCES talents(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255),
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for talent reviews
CREATE INDEX IF NOT EXISTS idx_talent_reviews_talent_id ON talent_reviews(talent_id);
CREATE INDEX IF NOT EXISTS idx_talent_reviews_user_id ON talent_reviews(user_id);

-- Enable RLS for talent reviews
ALTER TABLE talent_reviews ENABLE ROW LEVEL SECURITY;

-- Allow public read access to reviews
CREATE POLICY "Allow public read access to talent reviews" ON talent_reviews
    FOR SELECT USING (true);

-- Allow authenticated users to insert reviews
CREATE POLICY "Allow authenticated users to insert talent reviews" ON talent_reviews
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Allow users to update their own reviews
CREATE POLICY "Allow users to update their own talent reviews" ON talent_reviews
    FOR UPDATE USING (auth.uid() = user_id);

-- Create trigger for talent reviews
CREATE TRIGGER update_talent_reviews_updated_at 
    BEFORE UPDATE ON talent_reviews 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Insert sample reviews
INSERT INTO talent_reviews (talent_id, user_name, rating, comment) VALUES
((SELECT id FROM talents WHERE name = 'Priya Sharma' AND society = 'parel' LIMIT 1), 'Anita Mehta', 5, 'Priya is an amazing vocalist! Her performance at our wedding was absolutely magical.'),
((SELECT id FROM talents WHERE name = 'Priya Sharma' AND society = 'parel' LIMIT 1), 'Rajesh Kumar', 4, 'Great experience working with Priya. She was professional and her classical performance was outstanding.'),
((SELECT id FROM talents WHERE name = 'Rahul Patel' AND society = 'parel' LIMIT 1), 'Sunita Patel', 5, 'Hired Rahul for our wedding and he exceeded all expectations. His photography skills are exceptional!'); 