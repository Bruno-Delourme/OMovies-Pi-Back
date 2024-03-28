const debug = require("debug")("app:db")
const { Pool } = require("pg");

const client = new Pool();

module.exports = {
  originalClient: Pool,
  async query(...params) {
    debug(...params);
    return Pool.query(...params);
  },
};