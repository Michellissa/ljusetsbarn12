-- Update products: add image_urls column
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';
-- Migrate existing single image_url to image_urls
UPDATE products SET image_urls = ARRAY[image_url] WHERE image_url != '' AND image_urls = '{}';

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'ny',
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  swish_number TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  price NUMERIC(10, 2) NOT NULL
);

-- Create settings table for store configuration (Swish number etc)
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO settings (key, value) VALUES ('swish_number', '0701234567')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE settings ENABLE ROW LEVEL SECURITY;

-- Orders: anyone can insert, only admin can read/update/delete
CREATE POLICY "Public insert orders" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin read orders" ON orders FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin update orders" ON orders FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- Order items: anyone can insert, only admin can read
CREATE POLICY "Public insert order_items" ON order_items FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin read order_items" ON order_items FOR SELECT TO authenticated USING (true);

-- Settings: only admin can read/update
CREATE POLICY "Admin read settings" ON settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin update settings" ON settings FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
