-- Revert omovies:1.create_table from pg

BEGIN;

DROP TABLE "group", "user", "movie", "vote";

DROP DOMAIN  IF EXISTS public.email;

COMMIT;
