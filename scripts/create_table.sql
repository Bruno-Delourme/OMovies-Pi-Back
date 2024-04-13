BEGIN;

DROP FUNCTION IF EXISTS add_user(json) CASCADE;

DROP FUNCTION IF EXISTS update_user(json) CASCADE;

DROP TABLE IF EXISTS "user", "movie", "favorite_movie", "to_review_movie" CASCADE;

DROP DOMAIN  IF EXISTS public.email CASCADE;

CREATE DOMAIN email AS TEXT 
CHECK(VALUE ~ '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$');

CREATE TABLE "user" (
  "id" INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  "pseudo" TEXT UNIQUE NOT NULL,
  "email" email UNIQUE NOT NULL,
  "birthday" DATE NOT NULL,
  "password" TEXT NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "movie" (
  "id" INT NOT NULL PRIMARY KEY,
  "title" TEXT,
  "poster_path" TEXT,
  "overview" TEXT,
  "genre" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "favorite_movie" (
  "movie_id" INT REFERENCES "movie"(id),
  "user_id" INT REFERENCES "user"(id),
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "to_review_movie" (
  "movie_id" INT REFERENCES "movie"(id),
  "user_id" INT REFERENCES "user"(id),
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE OR REPLACE FUNCTION add_user(json) RETURNS "user" AS
$$
  INSERT INTO "user" (pseudo, email, birthday, password)
    VALUES (
      ($1 ->> 'pseudo'):: TEXT,
      ($1 ->> 'email'):: email,
      ($1 ->> 'birthday'):: DATE,
      ($1 ->> 'password'):: TEXT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_movie(json) RETURNS "movie" AS
$$
  INSERT INTO "movie"(id, title, poster_path, overview, genre)
    VALUES (
      ($1 ->> 'id'):: INT,
      ($1 ->> 'title'):: TEXT,
      ($1 ->> 'poster_path'):: TEXT,
      ($1 ->> 'overview'):: TEXT,
      ($1 ->> 'genre'):: TEXT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_favorite_movie(json) RETURNS "favorite_movie" AS
$$
   INSERT INTO "favorite_movie"(movie_id, user_id)
    VALUES (
      ($1 ->> 'movie_id'):: INT,
      ($1 ->> 'user_id'):: INT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_to_review_movie(json) RETURNS "to_review_movie" AS
$$
   INSERT INTO "to_review_movie"(movie_id, user_id)
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
      birthday = ($1->>'birthday')::DATE,
      password = ($1->>'password')::TEXT,
      updated_at = ($1->>'updated_at')::TIMESTAMPTZ
    WHERE id = ($1->>'id')::INT
    RETURNING *;
$$ LANGUAGE SQL STRICT;

COMMIT;