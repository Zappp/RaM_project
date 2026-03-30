DROP policy IF EXISTS "Users can view their own favorites" ON public.favorite_characters;

CREATE policy "Users can view their own favorites" ON public.favorite_characters FOR
SELECT
  TO authenticated USING (
    (
      SELECT
        auth.uid()
    ) = user_id
  );

DROP policy IF EXISTS "Users can delete their own favorites" ON public.favorite_characters;

CREATE policy "Users can delete their own favorites" ON public.favorite_characters FOR DELETE TO authenticated USING (
  (
    SELECT
      auth.uid()
  ) = user_id
);

DROP policy IF EXISTS "Users can insert their own favorites" ON public.favorite_characters;

CREATE policy "Users can insert their own favorites" ON public.favorite_characters FOR
INSERT
  TO authenticated WITH CHECK (
    (
      SELECT
        auth.uid()
    ) = user_id
  );

DROP policy IF EXISTS "Admin full access on characters" ON public.remote_characters;

CREATE policy "Admin full access on characters" ON public.remote_characters FOR ALL TO service_role USING (
  (
    SELECT
      auth.role()
  ) = 'service_role'
);

DROP policy IF EXISTS "Admin full access on count" ON public.remote_characters_count;

DROP policy IF EXISTS "Admin full access on characters" ON public.remote_characters;
