CREATE TABLE IF NOT EXISTS remote_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  PAGE integer NOT NULL UNIQUE,
  data jsonb NOT NULL,
  created_at timestamp WITH time zone DEFAULT NOW() NOT NULL,
  updated_at timestamp WITH time zone DEFAULT NOW() NOT NULL
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_remote_pages_page ON remote_pages(PAGE);
