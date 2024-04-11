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
      let toList = [];

      if (userResult.rows[0] && userResult.rows[0].list) {
          toList = userResult.rows[0].list;
      };

      const existingMovie = toList.find(item => item.name === movie.name);
      if (existingMovie) {
          return { message: 'Le film est déjà dans la liste des favoris.' };
      };

      toList.push({ name: movie.name, picture: movie.picture });
      // toList.push({ name: movie.name, picture: movie.picture, date_added: movie.date_added });

      const query = {
          text: 'UPDATE "user" SET list = $1 WHERE id = $2',
          values: [JSON.stringify(toList), user.id],
      };

      const results = await client.query(query);
      return results.rows[0];

  } catch (error) {
      console.error('Erreur lors de l\'insertion dans la liste des favoris :', error);
      throw error;
  }
  },

  async insertIntoToReview(user, movie) {
    try {
      const userQuery = {
          text: 'SELECT to_review FROM "user" WHERE id = $1',
          values: [user.id],
      };

      const userResult = await client.query(userQuery);
      let toToReview = [];

      if (userResult.rows[0] && userResult.rows[0].to_review) {
          toToReview = userResult.rows[0].to_review;
      };

      const existingMovie = toToReview.find(item => item.name === movie.name);
      if (existingMovie) {
          return { message: 'Le film est déjà dans la liste des films à revoir.' };
      };

      toToReview.push({ name: movie.name, picture: movie.picture });
      // toToReview.push({ name: movie.name, picture: movie.picture, date_added: movie.date_added });

      const query = {
          text: 'UPDATE "user" SET to_review = $1 WHERE id = $2',
          values: [JSON.stringify(toToReview), user.id],
      };

      const results = await client.query(query);
      return results.rows[0];

  } catch (error) {
      console.error('Erreur lors de l\'insertion dans la liste des films à revoir :', error);
      throw error;
  };
  },

  async showList(id) {
    try {
      const query = {
        text: 'SELECT list FROM "user" WHERE id = $1',
        values: [id]
      };
      const results = await client.query(query);
      return results.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste des favoris:', error);
        throw error;
    };
  },

  async showToReview(id) {
    try {
      const query = {
        text: 'SELECT to_review FROM "user" WHERE id = $1',
        values: [id]
      };
      const results = await client.query(query);
      return results.rows;
    } catch (error) {
      console.error('Erreur lors de la récupération de la liste à revoir:', error);
        throw error;
    };
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
      console.error('Erreur lors de la suppression du film :', error);
        throw error;
    };
  },

  async deleteFromList(user, movie) {
    try {
      const query = {
        text: 'SELECT delete_movie_from_list($1, $2, $3)',
        values: [user.id, movie.name, movie.picture]
      };

      await client.query(query);
        
      return { message: 'Le film a été supprimé de la liste des favoris.' };
      
  } catch (error) {
      console.error('Erreur lors de la suppression du film de la liste des favoris :', error);
      throw error;
  };
  },

  async deleteFromToReview(user, movie) {
    try {
      const query = {
        text: 'SELECT delete_movie_from_to_review($1, $2, $3)',
        values: [user.id, movie.name, movie.picture]
      };

      await client.query(query);
        
      return { message: 'Le film a été supprimé de la liste des films à revoir.' };
      
  } catch (error) {
      console.error('Erreur lors de la suppression du film de la liste des films à revoir :', error);
      throw error;
  };
  },
};

module.exports = listModel;