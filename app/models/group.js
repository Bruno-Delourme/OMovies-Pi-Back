const client = require('../data/client.js');

const groupModel = {
  async insert(group) {
    const query = {
      text: 'SELECT * FROM add_group($1)',
      values: [JSON.stringify(group)],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = groupModel;