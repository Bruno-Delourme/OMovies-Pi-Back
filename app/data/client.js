require("dotenv").config();
const { Pool } = require("pg");

const conf =
  process.env.NODE_ENV === "prod"
    ? {
        connectionString: process.env.PGHOST,
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {
        connectionString: process.env.PGHOST,
      };

module.exports = new Pool(conf);
