const client = require('../data/client.js');

const listModel = {
  async insert(movie) {
    const queryMovie = {
      text: 'SELECT * FROM add_movie($1)',
      values: [JSON.stringify(movie)],
    };
    
    const queryList = {
      text: 'INSERT INTO "movie" (list) VALUES = $1',
      values: [JSON.stringify(movie)],
    }
    const results = await client.query(queryMovie, queryList);
    return results.rows[0];
  },

  async show() {
    const results = await client.query('SELECT * FROM "movie"');
    return results.rows;
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