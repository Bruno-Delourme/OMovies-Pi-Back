const client = require("../data/client.js");

const userModel = {
  async insert(user) {
    const query = {
      text: 'SELECT * FROM add_user($1)',
      values: [JSON.stringify(user)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = userModel;