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

  async update(user) {
    const query = {
      text: 'SELECT * FROM update_user($1)',
      values: [JSON.stringify(user)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = userModel;