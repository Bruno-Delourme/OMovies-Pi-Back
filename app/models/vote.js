const client = require('../data/client.js');

const voteModel = {

  async insert(vote) {
    const query = {
      text: 'SELECT * FROM add_vote($1)',
      values: [JSON.stringify(vote)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = voteModel;