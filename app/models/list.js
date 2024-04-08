const client = require('../data/client.js');

const listModel = {

  async insertIntoMovie(movie) {
    try {
      const checkQuery = {
        text: 'SELECT name FROM movie WHERE name = $1',
        values: [movie.name],
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

  async insertIntoList(user, movie) {
    try {
      const userQuery = {
          text: 'SELECT list FROM "user" WHERE id = $1',
          values: [user.id],
      };

      const userResult = await client.query(userQuery);
      const toList = userResult.rows[0].list || '';

      if (toList.includes(movie.name)) {
          return { message: 'Le film est déjà dans la liste.' };
      };

      const query = {
          text: 'UPDATE "user" SET list = CONCAT(list, $1::TEXT) WHERE id = $2',
          values: [`, ${JSON.stringify({ name: movie.name, picture: movie.picture })}`, movie.id],
      };

      const results = await client.query(query);
      return results.rows[0];

  } catch (error) {
      console.error('Erreur lors de l\'insertion dans la liste :', error);
      throw error;
  };
},

  async insertIntoToReview(movie) {
    try {
      const userQuery = {
          text: 'SELECT to_review FROM "user" WHERE id = $1',
          values: [movie.id],
      };

      const userResult = await client.query(userQuery);
      const toReviewList = userResult.rows[0].to_review || '';

      if (toReviewList.includes(movie.name)) {
          return { message: 'Le film est déjà dans la liste à revoir.' };
      };

      const query = {
          text: 'UPDATE "user" SET to_review = CONCAT(to_review, $1::TEXT) WHERE id = $2',
          values: [`, ${JSON.stringify({ name: movie.name, picture: movie.picture })}`, movie.id],
      };

      const results = await client.query(query);
      return results.rows[0];
  } catch (error) {
      console.error('Erreur lors de l\'insertion dans la liste à revoir :', error);
      throw error;
  };
},

  async show() {
    const results = await client.query('SELECT * FROM "movie"');
    return results.rows;
  },

  async deleteFromMovie(movie) {
    try {
      const query = {
      text: 'DELETE FROM "movie" WHERE name = $1',
      values: [movie.name],
    };
    const results = await client.query(query);

    return !!results.rowCount;

    } catch (error) {
      console.error('Erreur lors de la suppression du film :', error); // Gestion des erreurs
        throw error;
    };
  },

  async deleteFromList(user, movie) {
    try {
      const userQuery = {
        text: 'SELECT list FROM "user" WHERE id = $1',
        values: [user.id]
      };

      const userResult = await client.query(userQuery);
      let toList = userResult.rows[0].list || '';

      if (!toList.includes(movieName)) {
        return { message: 'Le film n\' est pas dans la liste' };
      };

      toList = toList.replace(new RegExp(`, ${movie.name}(?={)`, 'g'), '');

      const query = {
        text: 'UPDATE "user" SET list = $1 WHERE id = $2',
        values: [toList, user.id],
      };

      await client.query(query);
      return { message: 'Le film a été supprimé de la liste.' };

    } catch (error) {
      console.error('Erreur lors de la suppression du film de la liste :', error);
        throw error;
    };
  },
};

module.exports = listModel;