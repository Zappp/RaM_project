DROP TABLE IF EXISTS remote_characters_count;

CREATE TABLE IF NOT EXISTS remote_characters_count (
  id boolean PRIMARY KEY DEFAULT TRUE,
  total_count integer NOT NULL,
  created_at timestamp WITH time zone DEFAULT NOW() NOT NULL,
  updated_at timestamp WITH time zone DEFAULT NOW() NOT NULL
);
