CREATE SEQUENCE IF NOT EXISTS order_number_seq;
GRANT USAGE, SELECT ON SEQUENCE order_number_seq TO authenticated;

CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'LB-' || to_char(now(), 'YYMMDD') || '-' || lpad(nextval('public.order_number_seq')::text, 4, '0');
END;
$$ LANGUAGE plpgsql;

ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS access_token UUID NOT NULL DEFAULT gen_random_uuid();
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

ALTER TABLE orders ALTER COLUMN order_number SET DEFAULT generate_order_number();

UPDATE orders SET order_number = generate_order_number() WHERE order_number IS NULL;

ALTER TABLE orders ALTER COLUMN order_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_idx ON orders (order_number);
CREATE UNIQUE INDEX IF NOT EXISTS orders_access_token_idx ON orders (access_token);

ALTER TABLE order_items ADD COLUMN IF NOT EXISTS product_name TEXT;

UPDATE order_items oi
SET product_name = p.name
FROM products p
WHERE oi.product_id = p.id AND oi.product_name IS NULL;

ALTER TABLE order_items ALTER COLUMN product_id DROP NOT NULL;
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES products (id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "Public read swish_number" ON settings;
CREATE POLICY "Public read swish_number"
  ON settings FOR SELECT
  TO public
  USING (key = 'swish_number');

DROP POLICY IF EXISTS "Admin insert settings" ON settings;
CREATE POLICY "Admin insert settings"
  ON settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin delete messages" ON messages;
CREATE POLICY "Admin delete messages"
  ON messages FOR DELETE
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Public insert orders" ON orders;
DROP POLICY IF EXISTS "Public insert order_items" ON order_items;
REVOKE INSERT ON orders FROM anon;
REVOKE INSERT ON order_items FROM anon;

GRANT SELECT ON settings TO anon, authenticated;

CREATE OR REPLACE FUNCTION create_order(
  p_customer_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_address TEXT,
  p_city TEXT,
  p_postal_code TEXT,
  p_message TEXT,
  p_items JSONB
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order_id UUID;
  v_order_number TEXT;
  v_access_token UUID;
  v_total NUMERIC(10, 2) := 0;
  v_item JSONB;
  v_product RECORD;
  v_qty INTEGER;
BEGIN
  IF p_customer_name IS NULL OR trim(p_customer_name) = ''
     OR p_phone IS NULL OR trim(p_phone) = ''
     OR p_email IS NULL OR trim(p_email) = ''
     OR p_address IS NULL OR trim(p_address) = ''
     OR p_city IS NULL OR trim(p_city) = ''
     OR p_postal_code IS NULL OR trim(p_postal_code) = '' THEN
    RAISE EXCEPTION 'Ofullständiga kunduppgifter';
  END IF;

  IF p_items IS NULL OR jsonb_array_length(p_items) = 0 THEN
    RAISE EXCEPTION 'Tom varukorg';
  END IF;

  INSERT INTO orders (
    customer_name, phone, email, address, city, postal_code, message,
    status, total, swish_number
  )
  VALUES (
    p_customer_name, p_phone, p_email, p_address, p_city, p_postal_code,
    COALESCE(p_message, ''), 'vantar_betalning', 0,
    (SELECT value FROM settings WHERE key = 'swish_number')
  )
  RETURNING id, order_number, access_token
  INTO v_order_id, v_order_number, v_access_token;

  FOR v_item IN SELECT value FROM jsonb_array_elements(p_items)
  LOOP
    v_qty := (v_item->>'quantity')::INTEGER;

    IF v_qty IS NULL OR v_qty <= 0 THEN
      RAISE EXCEPTION 'Ogiltigt antal';
    END IF;

    SELECT id, name, price, stock
    INTO v_product
    FROM products
    WHERE id = (v_item->>'product_id')::UUID
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Produkt saknas';
    END IF;

    IF v_product.stock < v_qty THEN
      RAISE EXCEPTION 'Otillräckligt lager för %', v_product.name;
    END IF;

    v_total := v_total + (v_product.price * v_qty);

    INSERT INTO order_items (order_id, product_id, quantity, price, product_name)
    VALUES (v_order_id, v_product.id, v_qty, v_product.price, v_product.name);

    UPDATE products SET stock = stock - v_qty WHERE id = v_product.id;
  END LOOP;

  UPDATE orders SET total = v_total WHERE id = v_order_id;

  RETURN jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'access_token', v_access_token,
    'total', v_total
  );
END;
$$;

REVOKE ALL ON FUNCTION create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION create_order(TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, JSONB) TO anon, authenticated;

CREATE OR REPLACE FUNCTION get_order_by_token(p_token UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_order JSONB;
  v_order_id UUID;
BEGIN
  SELECT to_jsonb(o), o.id
  INTO v_order, v_order_id
  FROM orders o
  WHERE o.access_token = p_token;

  IF v_order IS NULL THEN
    RETURN NULL;
  END IF;

  v_order := v_order || jsonb_build_object(
    'items', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'id', oi.id,
        'quantity', oi.quantity,
        'price', oi.price,
        'product_id', oi.product_id,
        'product_name', COALESCE(oi.product_name, p.name, 'Produkt')
      ) ORDER BY oi.id)
      FROM order_items oi
      LEFT JOIN products p ON p.id = oi.product_id
      WHERE oi.order_id = v_order_id
    ), '[]'::jsonb)
  );

  RETURN v_order;
END;
$$;

REVOKE ALL ON FUNCTION get_order_by_token(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION get_order_by_token(UUID) TO anon, authenticated;

CREATE OR REPLACE FUNCTION update_order_details(
  p_token UUID,
  p_customer_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_address TEXT,
  p_city TEXT,
  p_postal_code TEXT,
  p_message TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE orders
  SET customer_name = p_customer_name,
      phone = p_phone,
      email = p_email,
      address = p_address,
      city = p_city,
      postal_code = p_postal_code,
      message = COALESCE(p_message, '')
  WHERE access_token = p_token
    AND status = 'vantar_betalning';

  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION update_order_details(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION update_order_details(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

NOTIFY pgrst, 'reload schema';
