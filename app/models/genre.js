const client = require('../data/client.js');

const genreModel = {

  async insertIntoGenre(genre) {
    try {
      const checkQuery = {
        text: 'SELECT name FROM "genre" WHERE name = $1',
        values: [genre.name],
      };

      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'Gender is already registered'}
      };

      const insertQuery = {
        text: 'SELECT * FROM add_genre($1)',
        values: [JSON.stringify(genre)],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

    } catch (error) {
      debug('Error inserting gender :', error);
        throw error;
    };
  },
};
module.exports = genreModel;