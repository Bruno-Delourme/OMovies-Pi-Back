const client = require('../data/client.js');

const movieActorModel = {

  async insertIntoMovieActor(movie, actor) {
    try {
      // Check if the actor/film pair is already present in the database
      const userQuery = {
          text: 'SELECT * FROM "movie_actor" WHERE movie_id = $1 AND actor_id = $2',
          values: [movie.id, actor.id],
      };

      const userResult = await client.query(userQuery);

      // If the pair is already present, send a message again
      if (userResult.rows.length > 0) {
          return { message: 'The pair is already on the list.' };
      };

      // Insert favorite into database
      const insertQuery = {
          text: 'INSERT INTO "movie_actor" (movie_id, actor_id) VALUES ($1, $2) RETURNING *',
          values: [movie.id, actor.id],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

  } catch (error) {
      console.error('Error when inserting binomial :', error);
      throw error;
  }
  },

  async showMovieByActor(actor) {
    try {
      const query = {
        text: `SELECT * FROM "movie" 
                JOIN "movie_actor" ON "movie".id = "movie_actor".movie_id 
                JOIN "actor" ON "movie_actor".actor_id = "actor".id 
                WHERE "actor".name = $1`,
        values: [actor.name]
      };
      const results = await client.query(query);
      return results.rows;
      
    } catch (error) {
      console.error('Error retrieving list of movies by actor:', error);
        throw error;
    };
  },

  async showFavoriteByActor(user, actor) {
    try {
      const query = {
        text: `SELECT * FROM "movie"
                JOIN "favorite_movie" ON "movie".id = "favorite_movie".movie_id
                JOIN "movie_actor" ON "movie".id = "movie_actor".movie_id
                JOIN "actor" ON "movie_actor".actor_id = "actor".id
                JOIN "user" ON "favorite_movie".user_id = "user".id
                WHERE "user".id = $1
                AND "actor".name = $2`,
        values: [user.id, actor.name],
      };
      const results = await client.query(query);
      return results.rows;

    } catch {
      console.error('Error retrieving list of favorite movies by actor:', error);
        throw error;
    };
  },
};

module.exports = movieActorModel;