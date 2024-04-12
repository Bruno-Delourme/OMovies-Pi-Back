const client = require('../data/client.js');

const voteModel = {

  async insert(req, res) {
    debug('vote insert controller called');

    const { userId, movieId } = req.body;

    
  },
};

module.exports = voteModel;