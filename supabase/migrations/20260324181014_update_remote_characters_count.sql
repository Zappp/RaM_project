DROP TABLE IF EXISTS remote_characters_count;

CREATE TABLE IF NOT EXISTS remote_characters_count (
  id boolean PRIMARY KEY DEFAULT true,  
  total_count integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);