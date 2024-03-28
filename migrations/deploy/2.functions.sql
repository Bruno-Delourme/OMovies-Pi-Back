-- Deploy omovies:2.functions to pg

BEGIN;

CREATE FUNCTION add_user(json) RETURNS "user" AS
$$
  INSERT INTO "user" (pseudo, email, date_of_birth, hashed_password)
  VALUES (
    ($1 ->> 'pseudo'):: TEXT,
    ($1 ->> 'email'):: email,
    ($1 ->> 'date_of_birth'):: DATE,
    ($1 ->> 'hashed_password'):: TEXT
  ) RETURNING *;
  $$ LANGUAGE sql STRICT;

  CREATE FUNCTION add_group(json) RETURNS "group" AS
  $$
    INSERT INTO "group" (name)
    VALUES (
      ($1 ->> 'name'):: TEXT
    ) RETURNING *;
    $$ LANGUAGE sql STRICT;

COMMIT;
