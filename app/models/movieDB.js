const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const movieDBModel = {

  async insertIntoMovie(movie) {
    try {
      const checkQuery = {
        text: `SELECT id FROM "movie" WHERE id = $1`,
        values: [movie.id],
      };
      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'The movie is already recorded.' };
      };

      const insertQuery = {
            text: `SELECT * FROM add_movie($1)`,
            values: [JSON.stringify(movie)],
          };

      const results = await client.query(insertQuery);
      return results.rows[0];      

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async deleteFromMovie(movie) {
    try {
      const query = {
      text: `DELETE FROM "movie" WHERE id = $1`,
      values: [movie.id],
    };
    const results = await client.query(query);

    return !!results.rowCount;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

};

module.exports = movieDBModel;