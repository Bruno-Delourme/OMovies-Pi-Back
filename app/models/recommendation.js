const client = require('../data/client.js');

const recommendationModel = {
  
  async getRandomFavoriteMovieId(userId) {
    try {
      // Retrieve user's total number of favorite movies
      const countQuery = {
        text: 'SELECT COUNT(movie_id) FROM "favorite_movie" WHERE user_id = $1',
        values: [userId]
      };
      const countResult = await client.query(countQuery);
      const totalCount = parseInt(countResult.rows[0].count);

      // Generate a random number between 0 and total number of movies - 1
      const randomIndex = Math.floor(Math.random() * totalCount);

      // Select random movie ID from favorites list
      const randomMovieQuery = {
        text: 'SELECT * FROM "favorite_movie" WHERE user_id = $1 OFFSET $2 LIMIT 1',
        values: [userId, randomIndex]
      };
      const randomMovieResult = await client.query(randomMovieQuery);

      // Return random movie ID
      return randomMovieResult.rows[0].movie_id;

    } catch (error) {
      debug('Error recovering random movie ID:', error);
      throw error;
    }
  }
};

module.exports = recommendationModel;
