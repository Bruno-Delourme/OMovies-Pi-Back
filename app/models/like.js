const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const likeModel = {

  async insert(userId) {
    try {
     const query = {
      text: `INSERT INTO "like" (user_id) VALUES ($1)`,
      values: [userId],
    };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async findLike(userId) {
    try {
      const query = {
      text: `SELECT * FROM "like" WHERE user_id = $1`,
      values: [userId],
    };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async showTotalLikes() {
    try {
     const query = {
      text: `SELECT COUNT(*) AS total_likes FROM "like"`
    };

    const results = await client.query(query);
    return results.rows[0]; 

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async delete(userId) {
    try {
      const query = {
      text: `DELETE FROM "like" WHERE user_id = $1`,
      values: [userId],
    };

    const results = await client.query(query);
    return !!results.rowCount;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },
};

module.exports = likeModel;