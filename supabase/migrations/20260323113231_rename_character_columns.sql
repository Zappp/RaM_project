ALTER TABLE
  public.favorite_characters RENAME COLUMN character_id TO remote_id;

ALTER TABLE
  public.favorite_characters RENAME COLUMN character_name TO name;

ALTER TABLE
  public.favorite_characters RENAME COLUMN character_image TO image;

ALTER TABLE
  public.favorite_characters RENAME COLUMN character_status TO STATUS;

ALTER TABLE
  public.favorite_characters RENAME COLUMN character_species TO species;

ALTER TABLE
  public.favorite_characters DROP CONSTRAINT IF EXISTS favorite_characters_character_id_not_empty;

ALTER TABLE
  public.favorite_characters
ADD
  CONSTRAINT favorite_characters_remote_id_not_empty CHECK (char_length(remote_id) > 0);

ALTER TABLE
  public.favorite_characters DROP CONSTRAINT IF EXISTS favorite_characters_user_character_id_key;

ALTER TABLE
  public.favorite_characters
ADD
  CONSTRAINT favorite_characters_user_remote_id_key UNIQUE (user_id, remote_id);

DROP INDEX IF EXISTS idx_favorite_characters_character_id;

CREATE INDEX idx_favorite_characters_remote_id ON public.favorite_characters(remote_id);
