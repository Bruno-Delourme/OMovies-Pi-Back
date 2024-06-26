const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const commentModel = {

  async insert(comment) {
    try {
      const query = {
        text: 'SELECT * FROM add_comment($1)',
        values: [JSON.stringify(comment)],
      };

      const results = await client.query(query);
      return results.rows[0];

    } catch (error) {
        errorHandler._500(error, null, null);
    };
  },

  async show() {
    try {
      const query = {
        text: `SELECT comment.content, "user".pseudo 
              FROM "comment" 
              JOIN "user" ON comment.user_id = "user".id 
              ORDER BY comment.created_at DESC LIMIT(20)`
    };

    const results = await client.query(query);
    return results.rows;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async update(comment) {
    try {
      const query = {
        text: 'SELECT * FROM update_comment($1)',
        values: [JSON.stringify(comment)],
    };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async delete(id) {
    try {
      const query = {
        text: 'DELETE FROM "comment" WHERE id = $1',
        values: [id],
    };

    const results = await client.query(query);
    return !!results.rowCount;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },
};

module.exports = commentModel;