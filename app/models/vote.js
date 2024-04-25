const client = require('../data/client.js');

const voteModel = {

  async insert(vote) {
    try {
      const query = {
      text: `SELECT * FROM add_vote($1)`,
      values: [JSON.stringify(vote)],
    };
    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      throw error;
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
      throw error;
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
      throw error;
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
      throw error;
    };
  },

  async movieSelection(id) {
    try {
      // Select random movie ID and details from vote list
      const randomMovieQuery = {
        text: `SELECT * FROM "movie" 
               JOIN "vote" ON "movie".id = "vote".movie_id
               WHERE "vote".group_id = $1
               ORDER BY RANDOM()
               LIMIT 1`,
        values: [id]
      };
      const randomMovieResult = await client.query(randomMovieQuery);
  
      // Return random movie details
      return randomMovieResult.rows[0];
  
    } catch (error) {
      throw error;
    }
  }
};

module.exports = voteModel;