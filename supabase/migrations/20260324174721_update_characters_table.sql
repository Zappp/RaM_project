ALTER TABLE
  IF EXISTS remote_pages RENAME TO remote_characters;

ALTER TABLE
  IF EXISTS remote_characters RENAME COLUMN data TO characters;

ALTER TABLE
  IF EXISTS remote_characters RENAME COLUMN PAGE TO remote_page;

CREATE TABLE IF NOT EXISTS remote_characters_count (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  total_count integer NOT NULL,
  created_at timestamp WITH time zone DEFAULT NOW() NOT NULL,
  updated_at timestamp WITH time zone DEFAULT NOW() NOT NULL
);

INSERT INTO
  remote_characters_count (total_count, created_at, updated_at)
SELECT
  total_count,
  updated_at,
  updated_at
FROM
  remote_characters
WHERE
  total_count IS NOT NULL ON CONFLICT DO NOTHING;

ALTER TABLE
  IF EXISTS remote_characters DROP COLUMN IF EXISTS total_count;
