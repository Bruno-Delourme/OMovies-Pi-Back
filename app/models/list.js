const client = require('../data/client.js');

const listModel = {
  async insert(movie) {
    const query = {
      text: 'SELECT * FROM add_movie($1)',
      values: [JSON.stringify(movie)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = listModel;