const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const userModel = {

  async insert(user) {
    try {
      const query = {
        text: `SELECT * FROM add_user($1)`,
        values: [JSON.stringify(user)],
      };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
        errorHandler._500(error, null, null);
    }; 
  },

  async findByPseudoOrEmail(pseudo, email) {
    try {
      const query = {
        text: `SELECT * FROM "user" 
                WHERE pseudo = $1 OR email = $2`,
        values: [pseudo, email],
      };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
        errorHandler._500(error, null, null);
    }; 
  },

  async findUser(user) {
    try {
      const query = {
        text: `SELECT * FROM "user" WHERE pseudo = $1`,
        values: [user.pseudo],
      };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async showUser(user) {
    try {
      const query = {
        text: `SELECT pseudo FROM "user" 
              WHERE pseudo = $1`,
        values: [user.pseudo],
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
        text: `DELETE FROM "user" WHERE id = $1`,
        values: [id],
      };

    const results = await client.query(query);
    return !!results.rowCount;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async update(user) {
    try {
      const query = {
        text: `SELECT * FROM update_user($1)`,
        values: [JSON.stringify(user)],
      };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },
};

module.exports = userModel;