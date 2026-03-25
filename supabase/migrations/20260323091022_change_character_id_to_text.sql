ALTER TABLE public.favorite_characters
  ALTER COLUMN character_id TYPE TEXT
  USING character_id::text;

ALTER TABLE public.favorite_characters
  ADD CONSTRAINT favorite_characters_character_id_not_empty
  CHECK (char_length(character_id) > 0);