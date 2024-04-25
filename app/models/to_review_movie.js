const client = require('../data/client.js');

const toReviewMovieModel = {

  async insertIntoToReview(user, movie) {
    try {
      // Check if the movie is already in the user's to_review list
      const userQuery = {
          text: `SELECT * FROM "to_review_movie" 
                  WHERE user_id = $1 AND movie_id = $2`,
          values: [user.id, movie.id],
      };

      const userResult = await client.query(userQuery);

      // If the film is already present, send a message again
      if (userResult.rows.length > 0) {
          return { message: 'The movie is already on the list of films to watch again.' };
      }

      // Insert movie into database
      const insertQuery = {
          text: 'INSERT INTO "to_review_movie" (user_id, movie_id) VALUES ($1, $2) RETURNING *',
          values: [user.id, movie.id],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

  } catch (error) {
      debug('Error when inserting into the list of films to watch again :', error);
      throw error;
  }
  },

  async showToReview(id) {
    try {
      const query = {
        text: `SELECT * FROM "movie" WHERE id IN(
                SELECT movie_id FROM "to_review_movie" 
                  WHERE user_id = $1)`,
        values: [id]
      };
      const results = await client.query(query);
      return results.rows;

    } catch (error) {
      debug('Error retrieving favorites list:', error);
        throw error;
    };
  },

  async showNewToReview(id) {
    try {
      const query = {
        text: `SELECT * FROM "movie" WHERE id IN(
                SELECT movie_id FROM "to_review_movie" 
                  WHERE user_id = $1) 
                  ORDER BY created_at DESC`,
        values: [id]
      };
      const results = await client.query(query);
      return results.rows;

    } catch (error) {
      debug('Error retrieving list of new movies to rewatch:', error);
        throw error;
    };
  },

  async deleteFromToReview(user, movie) {
    try {
      const query = {
        text: `DELETE FROM "to_review_movie" 
                WHERE user_id = $1 AND movie_id = $2`,
        values: [user.id, movie.id]
      };

      await client.query(query);
        
      return { message: 'The movie has been removed from the list of films to watch again.' };
      
  } catch (error) {
      debug('Error removing movie from list of movies to watch again :', error);
      throw error;
  };
  },
};

module.exports = toReviewMovieModel;