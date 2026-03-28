ALTER TABLE
  public.favorite_characters
ADD
  COLUMN IF NOT EXISTS character_status TEXT,
ADD
  COLUMN IF NOT EXISTS character_species TEXT;
