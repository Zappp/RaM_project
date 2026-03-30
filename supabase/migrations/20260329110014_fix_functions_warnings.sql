CREATE
OR REPLACE FUNCTION public.update_updated_at() RETURNS trigger language plpgsql
SET
  search_path = public AS
$$
BEGIN
NEW.updated_at = NOW();

RETURN NEW;

END;

$$
;

DROP trigger IF EXISTS set_updated_at_characters ON public.remote_characters;

CREATE trigger set_updated_at_characters before
UPDATE
  ON public.remote_characters FOR each ROW EXECUTE FUNCTION public.update_updated_at();

DROP FUNCTION IF EXISTS public.update_timestamp_characters();

DROP trigger IF EXISTS set_updated_at_count ON public.remote_characters_count;

CREATE trigger set_updated_at_count before
UPDATE
  ON public.remote_characters_count FOR each ROW EXECUTE FUNCTION public.update_updated_at();

DROP FUNCTION IF EXISTS public.update_timestamp_count();

DROP trigger IF EXISTS update_favorite_characters_updated_at ON public.favorite_characters;

CREATE trigger update_favorite_characters_updated_at before
UPDATE
  ON public.favorite_characters FOR each ROW EXECUTE FUNCTION public.update_updated_at();

DROP FUNCTION IF EXISTS public.update_updated_at_column();

DROP FUNCTION IF EXISTS public.update_timestamp()
