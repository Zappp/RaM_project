CREATE TABLE IF NOT EXISTS public.favorite_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  character_id INTEGER NOT NULL,
  character_name TEXT NOT NULL,
  character_image TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, character_id)
);

CREATE INDEX IF NOT EXISTS idx_favorite_characters_user_id ON public.favorite_characters(user_id);

CREATE INDEX IF NOT EXISTS idx_favorite_characters_character_id ON public.favorite_characters(character_id);

ALTER TABLE
  public.favorite_characters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own favorites" ON public.favorite_characters FOR
SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites" ON public.favorite_characters FOR
INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" ON public.favorite_characters FOR DELETE USING (auth.uid() = user_id);

CREATE
OR REPLACE FUNCTION public.update_updated_at_column() RETURNS TRIGGER AS
$$
BEGIN
NEW.updated_at = NOW();

RETURN NEW;

END;

$$
LANGUAGE plpgsql;

CREATE TRIGGER update_favorite_characters_updated_at BEFORE
UPDATE
  ON public.favorite_characters FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
