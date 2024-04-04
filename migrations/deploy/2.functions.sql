-- Deploy omovies:2.functions to pg

BEGIN;

CREATE OR REPLACE FUNCTION add_user(json) RETURNS "user" AS
$$
  INSERT INTO "user" (pseudo, email, date_of_birth, hashed_password)
  VALUES (
    ($1 ->> 'pseudo'):: TEXT,
    ($1 ->> 'email'):: email,
    ($1 ->> 'date_of_birth'):: DATE,
    ($1 ->> 'hashed_password'):: TEXT
  ) RETURNING *;
  $$ LANGUAGE sql STRICT;

  CREATE OR REPLACE FUNCTION add_group(json) RETURNS "group" AS
  $$
    INSERT INTO "group" (name)
    VALUES (
      ($1 ->> 'name'):: TEXT
    ) RETURNING *;
    $$ LANGUAGE sql STRICT;

  CREATE OR REPLACE FUNCTION update_user(json) RETURNS "user" AS
  $$
    UPDATE "user" SET
      pseudo = ($1->>'pseudo')::TEXT,
      email = ($1->>'email')::email,
      date_of_birth = ($1->>'date_of_birth')::DATE,
      hashed_password = ($1->>'hashed_password')::TEXT
    WHERE id = ($1->>'id')::INT
    RETURNING *;
  $$ LANGUAGE SQL STRICT;

COMMIT;
