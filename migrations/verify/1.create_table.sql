-- Verify omovies:1.create_table on pg

BEGIN;

SELECT
  id,
  name,
  createdAt,
  updatedAt
FROM group;

SELECT
  id,
  pseudo,
  email,
  date_of_birth,
  password,
  list,
  to_review,
  group_id,
  createdAt,
  updatedAt
FROM user;

SELECT
  id,
  name,
  picture,
  description,
  createdAt,
  updatedAt
FROM movie;*

SELECT
  movie_id,
  user_id,
  createdAt,
  updatedAt
FROM vote;

ROLLBACK;
