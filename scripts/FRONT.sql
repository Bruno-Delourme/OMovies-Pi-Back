BEGIN;

DROP FUNCTION IF EXISTS add_user(json) CASCADE;

DROP FUNCTION IF EXISTS add_group(json) CASCADE;

DROP FUNCTION IF EXISTS update_user(json) CASCADE;

DROP FUNCTION IF EXISTS delete_movie_from_list(json) CASCADE;

DROP FUNCTION IF EXISTS delete_movie_from_to_review(json) CASCADE;

DROP TABLE IF EXISTS "group", "user", "movie", "vote" CASCADE;

DROP DOMAIN  IF EXISTS public.email CASCADE;

CREATE DOMAIN email AS TEXT 
CHECK(VALUE ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

CREATE TABLE "group" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "name" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "pseudo" TEXT UNIQUE NOT NULL,
  "email" email UNIQUE NOT NULL,
  "date_of_birth" DATE NOT NULL,
  "hashed_password" TEXT NOT NULL,
  "list" JSONB,
  "to_review" JSONB,
  "group_id" INT REFERENCES "group"(id),
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "movie" (
  "id" INT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "picture" TEXT,
  "description" TEXT,
  "genre" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "vote" (
  "movie_id" INT REFERENCES "movie"(id),
  "user_id" INT REFERENCES "user"(id),
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

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

CREATE OR REPLACE FUNCTION add_movie(json) RETURNS "movie" AS
$$
  INSERT INTO "movie"(id, name, picture, description, genre)
    VALUES (
      ($1 ->> 'id'):: INT,
      ($1 ->> 'name'):: TEXT,
      ($1 ->> 'picture'):: TEXT,
      ($1 ->> 'description'):: TEXT,
      ($1 ->> 'genre'):: TEXT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_vote(json) RETURNS "vote" AS
$$
   INSERT INTO "vote"(movie_id, user_id)
    VALUES (
      ($1 ->> 'movie_id'):: INT,
      ($1 ->> 'user_id'):: INT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION update_user(json) RETURNS "user" AS
$$
    UPDATE "user" SET
      pseudo = ($1->>'pseudo')::TEXT,
      email = ($1->>'email')::email,
      date_of_birth = ($1->>'date_of_birth')::DATE,
      hashed_password = ($1->>'hashed_password')::TEXT,
      updated_at = ($1->>'updated_at')::TIMESTAMPTZ
    WHERE id = ($1->>'id')::INT
    RETURNING *;
$$ LANGUAGE SQL STRICT;

CREATE OR REPLACE FUNCTION delete_movie_from_list(user_id INT, movie_id INT, movie_name TEXT, movie_picture TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "user"
  SET list = (
    SELECT COALESCE(
      (SELECT jsonb_agg(movie)
       FROM jsonb_array_elements("list") AS movie
       WHERE (movie->> 'id' <> movie_id OR movie->>'name' <> movie_name OR movie->>'picture' <> movie_picture)),
      '[]'::jsonb
    )
    FROM "user"
    WHERE id = user_id
  )
  WHERE id = user_id;
END;
$$;

CREATE OR REPLACE FUNCTION delete_movie_from_to_review(user_id INT, movie_id INT, movie_name TEXT, movie_picture TEXT)
  RETURNS VOID
  LANGUAGE plpgsql
AS $$
BEGIN
  UPDATE "user"
  SET to_review = (
    SELECT COALESCE(
      (SELECT jsonb_agg(movie)
       FROM jsonb_array_elements("to_review") AS movie
       WHERE (movie->> 'id' <> movie_id OR movie->>'name' <> movie_name OR movie->>'picture' <> movie_picture)),
      '[]'::jsonb
    )
    FROM "user"
    WHERE id = user_id
  )
  WHERE id = user_id;
END;
$$;

COMMIT;