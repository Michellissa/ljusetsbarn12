-- Nya kategorier för handdukar och biblar
INSERT INTO categories (name, slug) VALUES
  ('Handdukar', 'handdukar'),
  ('Biblar', 'biblar')
ON CONFLICT (slug) DO NOTHING;

NOTIFY pgrst, 'reload schema';
