-- Revert omovies:2.functions from pg

BEGIN;

DROP FUNCTION add_user(json);

DROP FUNCTION add_group(json);

DROP FUNCTION update_user(json);

DROP FUNCTION delete_movie_from_list(json);

DROP FUNCTION delete_movie_from_to_review(json);

COMMIT;
