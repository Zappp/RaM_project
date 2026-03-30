ALTER TABLE
  public.favorite_characters DROP CONSTRAINT favorite_characters_user_id_character_id_key;

ALTER TABLE
  public.remote_characters DROP CONSTRAINT remote_pages_page_key;

DROP INDEX IF EXISTS idx_favorite_characters_user_id;

DROP INDEX IF EXISTS idx_favorite_characters_remote_id;

CREATE INDEX IF NOT EXISTS remote_characters_count_id_idx ON public.remote_characters (count_id);
