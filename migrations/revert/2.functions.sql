-- Revert omovies:2.functions from pg

BEGIN;

DROP FUNCTION add_user(json);

DROP FUNCTION add_group(json);

COMMIT;
