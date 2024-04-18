const client = require('../data/client.js');

const likeModel = {

  async insert(userId) {
    const query = {
      text: 'INSERT INTO "like" (user_id) VALUES ($1)',
      values: [userId],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async findLike(userId) {
    const query = {
      text: 'SELECT * FROM "like" WHERE user_id = $1',
      values: [userId],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async showTotalLikes() {
    const query = {
      text: 'SELECT COUNT(*) AS total_likes FROM "like"'
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async delete(userId) {
    const query = {
      text: 'DELETE FROM "like" WHERE user_id = $1',
      values: [userId],
    };
    const results = await client.query(query);

    return !!results.rowCount;
  },
};

module.exports = likeModel;