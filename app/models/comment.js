const client = require('../data/client.js');

const commentModel = {

  async insert(comment) {
    const query = {
      text: 'SELECT * FROM add_comment($1)',
      values: [JSON.stringify(comment)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async show() {
    const query = {
      text: `SELECT comment.content, "user".pseudo 
              FROM "comment" 
              JOIN "user" ON comment.user_id = "user".id 
              ORDER BY comment.created_at DESC LIMIT(20)`
    };
    const results = await client.query(query);
    return results.rows;
  },
};

module.exports = commentModel;