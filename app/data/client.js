const debug = require("debug")("app:db")
const { Pool } = require("pg");

const pool = new Pool();

module.exports = {
  originalClient: pool,
  async query(...params) {
    debug(...params);
    return pool.query(...params);
  },
};