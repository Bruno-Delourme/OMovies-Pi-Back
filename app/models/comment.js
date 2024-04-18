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
};

module.exports = commentModel;