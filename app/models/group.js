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
      text: 'SELECT name, "group".id FROM "group" JOIN "user" ON "user".group_id = "group".id WHERE "user".id = $1',
      values: [id],
    };
    const results = await client.query(query);
    return results.rows[0];
  },

  async findGroupUsers(id) {
    const query = {
      text: 'SELECT pseudo FROM "user" JOIN "group" ON "user".group_id = "group".id WHERE "group".id = $1',
      values: [id]
    };
    const results = await client.query(query);
    return results.rows;
  },

  async addToGroup(group, user) {
    try {
      const query = {
          text: 'UPDATE "user" SET group_id = $1 WHERE pseudo = $2',
          values: [group.id, user.pseudo],
      };
      await client.query(query);
      
      return { status: 'success', message: 'User added to group successfully.' };

  } catch (error) {
      console.error('Error adding user to group:', error);
      return { status: 'error', message: 'Error adding user to group.' };
  };
  },

  async removeToGroup(user) {
    try {
      const query = {
        text: 'UPDATE "user" SET group_id = NULL WHERE pseudo = $1',
        values: [user.pseudo]
      };
      await client.query(query);

      return { status: 'success', message: 'User removed from group successfully.' };

    } catch (error) {
      console.error('Error removing user from group:', error);
      return { status: 'error', message: 'Error removing user from group.' };
    };
  },

  async deleteGroup(group, user) {
    
  }
};

module.exports = groupModel;