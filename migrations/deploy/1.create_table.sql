-- Deploy omovies:1.create_table to pg

BEGIN;

-- validation of email address format
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

COMMIT;
