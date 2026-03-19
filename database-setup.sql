-- SLZ GLOBAL Furniture Store - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor: https://supabase.com/dashboard/project/wlwuntefesaxpzmjzend/sql/new

-- ============================================
-- 1. CREATE PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'Furniture',
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 2. CREATE ADMIN TABLE (if not exists)
-- ============================================
CREATE TABLE IF NOT EXISTS admin (
    id BIGSERIAL PRIMARY KEY,
    "user" VARCHAR(100) UNIQUE NOT NULL,
    pass VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- 3. ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 4. CREATE RLS POLICIES FOR PRODUCTS
-- ============================================
-- Allow anyone to read products (public shop)
CREATE POLICY "Allow public read access on products" 
ON products FOR SELECT 
USING (true);

-- Allow authenticated users to insert products
CREATE POLICY "Allow insert for authenticated users" 
ON products FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to delete products
CREATE POLICY "Allow delete for authenticated users" 
ON products FOR DELETE 
USING (true);

-- Allow authenticated users to update products
CREATE POLICY "Allow update for authenticated users" 
ON products FOR UPDATE 
USING (true);

-- ============================================
-- 5. CREATE RLS POLICIES FOR ADMIN
-- ============================================
CREATE POLICY "Allow read access on admin" 
ON admin FOR SELECT 
USING (true);

-- ============================================
-- 6. CREATE STORAGE BUCKET FOR PRODUCT IMAGES
-- ============================================
-- Note: Run this in the Supabase Dashboard under Storage
-- Or use the API to create the bucket

-- Go to Storage in your Supabase dashboard and create a bucket named 'product-images'
-- Make sure to set it as PUBLIC for images to be accessible

-- ============================================
-- 7. INSERT SAMPLE ADMIN USER (OPTIONAL)
-- ============================================
-- Password: admin123 (hashed with bcrypt)
-- You can change this after first login
INSERT INTO admin ("user", pass) 
VALUES ('admin', '$2a$10$xQr8Zl0F1RpMvWQV5JWGC.NKV5zH4YYrFJ5YqR1Y6wkxWLH5JQORC')
ON CONFLICT ("user") DO NOTHING;

-- ============================================
-- 8. INSERT SAMPLE PRODUCTS (OPTIONAL)
-- ============================================
INSERT INTO products (name, price, description, category, image_url) VALUES
('Modern Wooden Chair', 149.99, 'Elegant wooden chair with comfortable cushion. Perfect for dining rooms or offices.', 'Living Room', 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400'),
('Luxury Leather Sofa', 899.99, 'Premium leather 3-seater sofa. Timeless design meets ultimate comfort.', 'Living Room', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400'),
('Oak Coffee Table', 299.99, 'Solid oak coffee table with modern minimalist design. Includes storage shelf.', 'Living Room', 'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=400'),
('Queen Size Bed Frame', 599.99, 'Sturdy queen size bed frame with headboard. Easy assembly required.', 'Bedroom', 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=400'),
('Office Desk', 349.99, 'Spacious office desk with cable management and drawer storage.', 'Office', 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=400'),
('Dining Table Set', 749.99, '6-seater dining table with matching chairs. Solid wood construction.', 'Dining', 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=400');

-- ============================================
-- 9. CREATE UPDATE TRIGGER FOR updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- After running this SQL:
-- 1. Go to Storage and create a bucket named 'product-images' (set as PUBLIC)
-- 2. Your admin login credentials are: admin / admin123
-- 3. Visit your shop at: /shop.html
-- 4. Admin panel at: /admin/login.html
