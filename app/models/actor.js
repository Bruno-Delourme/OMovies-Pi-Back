const client = require('../data/client.js');

const actorModel = {

  async insertIntoActor(actor) {
    try {
      const checkQuery = {
        text: 'SELECT name FROM "actor" WHERE name = $1',
        values: [actor.name],
      };

      const checkResult = await client.query(checkQuery);

      if (checkResult.rows.length > 0) {
        return { message: 'Actor is already registered'}
      };

      const insertQuery = {
        text: 'SELECT * FROM add_actor($1)',
        values: [JSON.stringify(actor)],
      };

      const results = await client.query(insertQuery);
      return results.rows[0];

    } catch (error) {
      debug('Error inserting actor :', error);
        throw error;
    };
  },
};
module.exports = actorModel;