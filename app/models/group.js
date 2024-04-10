const client = require('../data/client.js');

const groupModel = {

  async create(group, user) {
    try {
      await client.query('BEGIN');

      const createQuery = {
          text: 'SELECT * FROM add_group($1)',
          values: [JSON.stringify(group)],
      };
      const groupResult = await client.query(createQuery);
      const groupId = groupResult.rows[0].id;

      const updateUserQuery = {
          text: 'UPDATE "user" SET group_id = $1 WHERE id = $2',
          values: [groupId, user.id],
      };
      await client.query(updateUserQuery);

      await client.query('COMMIT');

      return groupResult.rows[0];

  } catch (error) {
      await client.query('ROLLBACK');
      throw error;

  } finally {
      client.release();
  };
},

  async findGroup(id) {
    const query = {
      text: 'SELECT name FROM "group" JOIN "user" ON "user".group_id = "group".id WHERE "user".id = $1',
      values: [id],
    };
    const results = await client.query(query);
    return results.rows[0];
  },
};

module.exports = groupModel;