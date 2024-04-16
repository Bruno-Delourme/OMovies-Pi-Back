BEGIN;

DROP FUNCTION IF EXISTS add_user(json) CASCADE;
DROP FUNCTION IF EXISTS add_movie(json) CASCADE;
DROP FUNCTION IF EXISTS add_genre(json) CASCADE;
DROP FUNCTION IF EXISTS add_actor(json) CASCADE;
DROP FUNCTION IF EXISTS add_favorite_movie(json) CASCADE;
DROP FUNCTION IF EXISTS add_to_review_movie(json) CASCADE;
DROP FUNCTION IF EXISTS add_to_movie_genre(json) CASCADE;
DROP FUNCTION IF EXISTS add_to_movie_actor(json) CASCADE;
DROP FUNCTION IF EXISTS update_user(json) CASCADE;

DROP TABLE IF EXISTS "user", "movie","genre", "actor", "favorite_movie", "to_review_movie", "movie_genre", "movie_actor" CASCADE;

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
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "genre" (
  "id" INT NOT NULL PRIMARY KEY,
  "name" TEXT,
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "actor" (
  "id" INT NOT NULL PRIMARY KEY,
  "name" TEXT,
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

CREATE TABLE "movie_genre" (
  "movie_id" INT REFERENCES "movie"(id),
  "genre_id" INT REFERENCES "genre"(id),
  "created_at" TIMESTAMPTZ NOT NULL default(now()),
  "updated_at" TIMESTAMPTZ
);

CREATE TABLE "movie_actor" (
  "movie_id" INT REFERENCES "movie"(id),
  "actor_id" INT REFERENCES "actor"(id),
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
  INSERT INTO "movie"(id, title, poster_path, overview)
    VALUES (
      ($1 ->> 'id'):: INT,
      ($1 ->> 'title'):: TEXT,
      ($1 ->> 'poster_path'):: TEXT,
      ($1 ->> 'overview'):: TEXT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_genre(json) RETURNS "genre" AS
$$
  INSERT INTO "genre"(id, name)
    VALUES (
      ($1 ->> 'id'):: INT,
      ($1 ->> 'name'):: TEXT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_actor(json) RETURNS "actor" AS
$$
  INSERT INTO "actor"(id, name)
    VALUES (
      ($1 ->> 'id'):: INT,
      ($1 ->> 'name'):: TEXT
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

CREATE OR REPLACE FUNCTION add_to_movie_genre(json) RETURNS "movie_genre" AS
$$
   INSERT INTO "movie_genre"(movie_id, genre_id)
    VALUES (
      ($1 ->> 'movie_id'):: INT,
      ($1 ->> 'user_id'):: INT
  ) RETURNING *;
$$ LANGUAGE sql STRICT;

CREATE OR REPLACE FUNCTION add_to_movie_actor(json) RETURNS "movie_actor" AS
$$
   INSERT INTO "movie_actor"(movie_id, actor_id)
    VALUES (
      ($1 ->> 'movie_id'):: INT,
      ($1 ->> 'actor_id'):: INT
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