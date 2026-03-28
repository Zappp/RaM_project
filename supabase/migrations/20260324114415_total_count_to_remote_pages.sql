ALTER TABLE
  remote_pages
ADD
  COLUMN IF NOT EXISTS total_count integer NOT NULL;
