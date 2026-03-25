-- Drop tables if they exist
DROP TABLE IF EXISTS public.remote_characters;
DROP TABLE IF EXISTS public.remote_characters_count;

CREATE TABLE public.remote_characters_count (
  id boolean PRIMARY KEY DEFAULT true,
  total_count integer NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

ALTER TABLE public.remote_characters_count ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.remote_characters_count FROM PUBLIC;

CREATE POLICY "Admin full access on count"
ON public.remote_characters_count
FOR ALL
TO public
USING (auth.role() = 'service_role');

CREATE POLICY "Users can read count"
ON public.remote_characters_count
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION update_timestamp_count()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_count
BEFORE UPDATE ON public.remote_characters_count
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_count();

INSERT INTO public.remote_characters_count (id, total_count) VALUES (true, 0)
ON CONFLICT (id) DO NOTHING;

CREATE TABLE public.remote_characters (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  remote_page integer NOT NULL,
  characters jsonb NOT NULL,
  count_id boolean NOT NULL DEFAULT true,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT remote_pages_pkey PRIMARY KEY (id),
  CONSTRAINT remote_pages_page_key UNIQUE (remote_page),
  CONSTRAINT fk_count FOREIGN KEY (count_id)
      REFERENCES public.remote_characters_count (id)
      ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_remote_pages_page
ON public.remote_characters USING btree (remote_page);

ALTER TABLE public.remote_characters ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public.remote_characters FROM PUBLIC;

CREATE POLICY "Admin full access on characters"
ON public.remote_characters
FOR ALL
TO public
USING (auth.role() = 'service_role');

CREATE POLICY "Users can read characters"
ON public.remote_characters
FOR SELECT
TO authenticated
USING (true);

CREATE OR REPLACE FUNCTION update_timestamp_characters()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at_characters
BEFORE UPDATE ON public.remote_characters
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_characters();