ALTER TABLE
  remote_characters_count ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON remote_characters_count
FROM
  PUBLIC;

CREATE POLICY "Admin can access remote_characters_count" ON remote_characters_count FOR ALL TO public USING (auth.role() = 'service_role');

CREATE
OR REPLACE FUNCTION update_timestamp() RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();

RETURN NEW;

END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at BEFORE
UPDATE
  ON remote_characters_count FOR EACH ROW EXECUTE FUNCTION update_timestamp();
