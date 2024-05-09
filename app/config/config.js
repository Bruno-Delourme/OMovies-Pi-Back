require("dotenv").config();

const PROD = process.env.NODE_ENV || false;

const config = {
  PGUSER: process.env.PGUSER,
  PGPASSWORD: process.env.PGPASSWORD,
  PGDATABASE: process.env.PGDATABASE,
  PGHOST: !PROD ? "localhost" : process.env.PGHOST,
  PGPORT: !PROD ? 5432 : process.env.PGPORT,
  PORT: process.env.PORT || 3000,
  PASSWORD_SALT: process.env.PASSWORD_SALT || 10,
  JWT_SECRET: process.env.JWT_SECRET || "secret",
  API_TMDB_BASE_URL: process.env.API_TMDB_BASE_URL,
  API_TMDB_KEY: process.env.API_TMDB_KEY,

  OUTLOOK_USER: process.env.OUTLOOK_USER,
  OUTLOOK_PASSWORD: process.env.OUTLOOK_PASSWORD,
};

config.PROD = PROD;

module.exports = config;
