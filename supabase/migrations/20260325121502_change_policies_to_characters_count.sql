DROP TABLE IF EXISTS remote_characters_count;

CREATE TABLE IF NOT EXISTS remote_characters_count (
  id boolean PRIMARY KEY DEFAULT true,
  total_count integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE remote_characters_count ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON remote_characters_count FROM PUBLIC;

CREATE POLICY "Admin full access"
ON remote_characters_count
FOR ALL
TO public
USING (auth.role() = 'service_role');

CREATE POLICY "Users can read"
ON remote_characters_count
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
BEFORE UPDATE ON remote_characters_count
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();