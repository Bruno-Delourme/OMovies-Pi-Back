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

  async delete(id) {
    const query = {
      text: 'DELETE FROM "movie" WHERE id = $1',
      values: [id],
    };
    const results = await client.query(query);

    return !!results.rowCount;
  },
};

module.exports = listModel;