const client = require('../data/client.js');

const userModel = {

  async insert(user) {
    const query = {
      text: 'SELECT * FROM add_user($1)',
      values: [JSON.stringify(user)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async findUser(user) {
    const query = {
      text: 'SELECT * FROM "user" WHERE pseudo = $1',
      values: [user.pseudo],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async delete(id) {
    const query = {
      text: 'DELETE FROM "user" WHERE id = $1',
      values: [id],
    };
    const results = await client.query(query);
    
    return !!results.rowCount;
  },

  async update(id, pseudo, email, date_of_birth, password) {

    if (!pseudo && !email && !date_of_birth && !password) {
      return "Aucune information à mettre à jour.";
    };

    const query = {
      text: `UPDATE "user" SET
              "pseudo" = $2,
              "email" = $3,
              "date_of_birth" = $4,
              "hashed_password" = $5
            WHERE id = $1`,
      values: [id, pseudo, email, date_of_birth, password],
    };
    const results = await client.query(query);

    if (results.rowCount > 0) {
      return true; 

  } else {
      return false;
  };
  },
};

module.exports = userModel;