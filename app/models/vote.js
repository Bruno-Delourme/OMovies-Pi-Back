const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const voteModel = {

  async insert(vote) {
    try {
      const checkQuery = {
        text: `SELECT user_id FROM "vote" WHERE user_id = $1`,
        values: [vote.user_id],
      };

      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'The user has already voted' }
      };

      const insertQuery = {
        text: `SELECT * FROM add_vote($1)`,
        values: [JSON.stringify(vote)],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

    } catch (error) {
        errorHandler._500(error, null, null);
    };
  },

  async show(id) {
    try {
     const query = {
      text: `SELECT * FROM "movie" WHERE id IN(
              SELECT movie_id FROM "vote"
                WHERE group_id = $1)`,
      values: [id],
    };

    const results = await client.query(query);
    return results.rows; 

    } catch (error){
        errorHandler._500(error, null, null);
    };
  },

  async update(user, movie) {
    try {
      const query = {
      text: `UPDATE "vote"
              SET movie_id = $2, updated_at = $3
              WHERE user_id = $1`,
      values: [user.id, movie.id, movie.updated_at]
    };
    
    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async delete(id) {
    try {
      const query = {
      text: `DELETE FROM "vote"
              WHERE user_id = $1`,
      values: [id]
    };

    await client.query(query);
    return { message: 'The vote was deleted'}

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async movieSelection(group) {
    try {
      const checkQuery = {
        text: `SELECT selection_id FROM "group"
                WHERE id = $1 AND selection_id IS NOT NULL`,
        values: [group.id]
      };

      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'The selection of the film has already been made' };
      };

      // Select random movie ID and details from vote list
      const randomMovieQuery = {
        text: `SELECT * FROM "movie" 
               JOIN "vote" ON "movie".id = "vote".movie_id
               WHERE "vote".group_id = $1
               ORDER BY RANDOM()
               LIMIT 1`,
        values: [group.id]
      };

      const randomMovieResult = await client.query(randomMovieQuery);
      const movieId = randomMovieResult.rows[0].id;

      const insertQuery = {
        text: `UPDATE "group"
                SET selection_id = $2, updated_at = $3
                WHERE id = $1`,
        values: [group.id, movieId, group.updated_at]
      };

      const insertResult = await client.query(insertQuery);
  
      // Return random movie details
      return randomMovieResult.rows[0];
  
    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async showMovieSelection(group) {
    try {
      const query = {
        text: `SELECT * FROM "movie" WHERE id IN(
                SELECT selection_id FROM "group"
                WHERE id = $1)`,
        values: [group.id]
      };

      const results = await client.query(query);

      return results.rows;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },
};

module.exports = voteModel;