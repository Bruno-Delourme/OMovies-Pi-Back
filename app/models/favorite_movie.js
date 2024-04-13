const client = require('../data/client.js');

const favoriteMovieModel = {

  async insertIntoFavorite(user, movie) {
    try {
      // Check if the movie is already in the user's favorite list
      const userQuery = {
          text: 'SELECT * FROM "favorite_movie" WHERE user_id = $1 AND movie_id = $2',
          values: [user.id, movie.id],
      };

      const userResult = await client.query(userQuery);

      // If the film is already present, send a message again
      if (userResult.rows.length > 0) {
          return { message: 'Le film est déjà dans la liste des favoris.' };
      }

      // Insert favorite into database
      const insertQuery = {
          text: 'INSERT INTO "favorite_movie" (user_id, movie_id) VALUES ($1, $2) RETURNING *',
          values: [user.id, movie.id],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

  } catch (error) {
      console.error('Erreur lors de l\'insertion dans la liste des favoris :', error);
      throw error;
  }
  },

  async showFavorite(id) {
    try {
      const query = {
        text: 'SELECT * FROM "movie" WHERE id IN( SELECT movie_id FROM "favorite_movie" WHERE user_id = $1)',
        values: [id]
      };
      const results = await client.query(query);
      return results.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des favoris:', error);
        throw error;
    };
  },

  async deleteFromFavorite(user, movie) {
    try {
      const query = {
        text: 'DELETE FROM "favorite_movie" WHERE user_id = $1 AND movie_id = $2',
        values: [user.id, movie.id]
      };

      await client.query(query);
        
      return { message: 'Le film a été supprimé de la liste des favoris.' };
      
  } catch (error) {
      console.error('Erreur lors de la suppression du film de la liste des favoris :', error);
      throw error;
  };
  },
};

module.exports = favoriteMovieModel;