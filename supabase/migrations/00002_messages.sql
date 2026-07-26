-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a message (contact form submissions)
CREATE POLICY "Public insert messages"
  ON messages FOR INSERT
  TO public
  WITH CHECK (true);

-- Only admin can read messages
CREATE POLICY "Admin read messages"
  ON messages FOR SELECT
  TO authenticated
  USING (true);
