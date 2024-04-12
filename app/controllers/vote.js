const debug = require('debug')('app:controller');
require('dotenv').config();
const voteModel = require('../models/vote.js');
const voteDataMapper = require('../models/vote.js');

const voteController = {

  async create(req, res) {
    debug('vote create controller called');

    const { movieId } = req.body;
    const userId = req.user.id;

    try {
      const createVote = await voteDataMapper.insert({ movie_id: movieId, user_id: userId });

    } catch {
      debug('Erreur lors de la création du vote :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création du vote.' });
    };
  },
};

module.exports = voteController;