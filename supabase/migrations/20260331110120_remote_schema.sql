DROP extension IF EXISTS "pg_net";

CREATE TABLE "public"."testing_ci" ("id" uuid NOT NULL DEFAULT gen_random_uuid());

CREATE UNIQUE INDEX testing_ci_pkey ON public.testing_ci USING btree (id);

ALTER TABLE
  "public"."testing_ci"
ADD
  CONSTRAINT "testing_ci_pkey" PRIMARY KEY USING INDEX "testing_ci_pkey";

GRANT DELETE ON TABLE "public"."testing_ci" TO "anon";

GRANT
INSERT
  ON TABLE "public"."testing_ci" TO "anon";

GRANT REFERENCES ON TABLE "public"."testing_ci" TO "anon";

GRANT
SELECT
  ON TABLE "public"."testing_ci" TO "anon";

GRANT trigger ON TABLE "public"."testing_ci" TO "anon";

GRANT TRUNCATE ON TABLE "public"."testing_ci" TO "anon";

GRANT
UPDATE
  ON TABLE "public"."testing_ci" TO "anon";

GRANT DELETE ON TABLE "public"."testing_ci" TO "authenticated";

GRANT
INSERT
  ON TABLE "public"."testing_ci" TO "authenticated";

GRANT REFERENCES ON TABLE "public"."testing_ci" TO "authenticated";

GRANT
SELECT
  ON TABLE "public"."testing_ci" TO "authenticated";

GRANT trigger ON TABLE "public"."testing_ci" TO "authenticated";

GRANT TRUNCATE ON TABLE "public"."testing_ci" TO "authenticated";

GRANT
UPDATE
  ON TABLE "public"."testing_ci" TO "authenticated";

GRANT DELETE ON TABLE "public"."testing_ci" TO "service_role";

GRANT
INSERT
  ON TABLE "public"."testing_ci" TO "service_role";

GRANT REFERENCES ON TABLE "public"."testing_ci" TO "service_role";

GRANT
SELECT
  ON TABLE "public"."testing_ci" TO "service_role";

GRANT trigger ON TABLE "public"."testing_ci" TO "service_role";

GRANT TRUNCATE ON TABLE "public"."testing_ci" TO "service_role";

GRANT
UPDATE
  ON TABLE "public"."testing_ci" TO "service_role";
