const client = require('../data/client.js');

const recommendationModel = {
  
  async getRandomFavoriteMovieId(userId) {
    try {
      // Select random movie ID from favorites list
      const randomMovieQuery = {
        text: `SELECT movie_id FROM "favorite_movie" 
               WHERE user_id = $1
               ORDER BY RANDOM()
               LIMIT 1`,
        values: [userId]
      };
      const randomMovieResult = await client.query(randomMovieQuery);
  
      // Return random movie ID
      if (randomMovieResult.rows.length > 0) {
        return randomMovieResult.rows[0].movie_id;
      } else {
        throw new Error('No favorite movies found for the user');
      }
  
    } catch (error) {
      debug('Error recovering random movie ID:', error);
      throw error;
    }
  },
};

module.exports = recommendationModel;
