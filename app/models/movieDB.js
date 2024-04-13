const client = require('../data/client.js');

const movieDBModel = {

  async insertIntoMovie(movie) {
    try {
      const checkQuery = {
        text: 'SELECT title FROM movie WHERE title = $1',
        values: [movie.title],
      };
      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'Le film est déjà enregistré.' }
      };

      const insertQuery = {
            text: 'SELECT * FROM add_movie($1)',
            values: [JSON.stringify(movie)],
          };

      const results = await client.query(insertQuery);
      return results.rows[0];      

    } catch (error) {
      console.error('Erreur lors de l\'insertion du film :', error); // Gestion des erreurs
        throw error;
    };
  },

  async deleteFromMovie(movie) {
    try {
      const query = {
      text: 'DELETE FROM "movie" WHERE id = $1',
      values: [movie.id],
    };
    const results = await client.query(query);

    return !!results.rowCount;

    } catch (error) {
      console.error('Erreur lors de la suppression du film :', error);
        throw error;
    };
  },

};

module.exports = movieDBModel;