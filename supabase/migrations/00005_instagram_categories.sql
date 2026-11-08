-- Kategorier från Ljusets Barns Instagram-beskrivning
INSERT INTO categories (name, slug) VALUES
  ('Dophanddukar', 'dophanddukar'),
  ('Plexi', 'plexi'),
  ('Hantverk', 'hantverk')
ON CONFLICT (slug) DO NOTHING;

NOTIFY pgrst, 'reload schema';
