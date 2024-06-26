const client = require('../data/client.js');
const errorHandler = require('../service/error.js');

const groupModel = {

  async create(group, user) {
    try {
      const createQuery = {
          text: `SELECT * FROM add_group($1)`,
          values: [JSON.stringify(group)],
      };

      const groupResult = await client.query(createQuery);
      const groupId = groupResult.rows[0].id;

      const updateUserQuery = {
          text: `UPDATE "user" 
                  SET group_id = $1, updated_at = $2 
                  WHERE id = $3`,
          values: [groupId, user.updated_at, user.id],
      };

      await client.query(updateUserQuery);
      return groupResult.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async findGroup(id) {
    try {
      const query = {
      text: `SELECT name, "group".id 
              FROM "group" 
              JOIN "user" ON "user".group_id = "group".id 
              WHERE "user".id = $1`,
      values: [id],
    };

    const results = await client.query(query);
    return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async findGroupUsers(id) {
    try {
      const query = {
        text: `SELECT pseudo 
                FROM "user" 
                JOIN "group" ON "user".group_id = "group".id 
                WHERE "group".id = $1`,
        values: [id]
      };

      const results = await client.query(query);
      return results.rows;

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async addToGroup(group, user) {
    try {
      const checkQuery = {
        text: `SELECT * FROM "user"
                WHERE group_id = $1`,
        values: [group.id],
      };

      const userResult = await client.query(checkQuery);

      if (userResult.rows.length >= 4) {
        return { message: 'The group is full'};
      };

      const query = {
          text: `UPDATE "user" 
                  SET group_id = $1, updated_at = $2
                  WHERE pseudo = $3`,
          values: [group.id, user.updated_at, user.pseudo],
      };
      const results = await client.query(query);
      
      return results.rows[0];

    } catch (error) {
       errorHandler._500(error, null, null);
    };
  },

  async removeToGroup(user) {
    try {
      const query = {
        text: `UPDATE "user" 
                SET group_id = NULL, updated_at = $2
                WHERE pseudo = $1`,
        values: [user.pseudo, user.updated_at]
      };
      const results = await client.query(query);

      return results.rows[0];

    } catch (error) {
      errorHandler._500(error, null, null);
    };
  },

  async delete(group) {
    try {
      const updateUserGroupQuery = {
                text: `UPDATE "user" 
                        SET group_id = NULL, updated_at = $2
                        WHERE group_id = $1`,
                values: [group.id, group.updated_at]
            };
            await client.query(updateUserGroupQuery);

      const deleteGroupQuery = {
          text: `DELETE FROM "group" WHERE id = $1`,
          values: [group.id]
      };
      const results = await client.query(deleteGroupQuery);

      return !!results.rowCount;

    } catch (error) {
        errorHandler._500(error, null, null);
    };
  },
};

module.exports = groupModel;