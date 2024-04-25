const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const voteDataMapper = require('../models/vote.js');
const movieDBDataMapper = require('../models/movieDB.js');

const voteController = {

  async create(req, res) {
    debug('vote create controller called');

    try {
      const movieId = req.body.id;
      const title = req.body.title;
      const poster_path = req.body.poster_path;
      const overview = req.body.overview;

      const groupId = req.body.groupId;
      const userId = req.params.id;

      if (!movieId || !title || !overview || !groupId) {
        return errorHandler._400('Incomplete data', req, res);
      };

      const picture = poster_path || 'No poster';

      // Insert the movie into the database
      const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

      const createVote = await voteDataMapper.insert({ user_id: userId, movie_id: movieId, group_id: groupId });

      res.json({ status: 'success', data: { insertIntoMovie, createVote} });

    } catch {
      debug('Error creating vote :', error);
      errorHandler._500("Error creating vote", req, res);
    };
  },

  async showVote(req, res) {
    debug('vote show controller called');

    try {
      const id = req.params.id;

      const vote = await voteDataMapper.show(id);

      res.json({ status: 'success', data: vote });

    } catch (error) {
      errorHandler._500('Error displaying the vote', req, res);
    };
  },

  async updateVote(req, res) {
    debug('vote update controller called');

    try {
      const movieId = req.body.id;
      const title = req.body.title;
      const poster_path = req.body.poster_path;
      const overview = req.body.overview;

      const groupId = req.body.groupId;
      const userId = req.params.id;

      if (!movieId || !title || !overview || !groupId) {
        return errorHandler._400('Incomplete data', req, res);
      };

      const picture = poster_path || 'No poster';

      const updated_at = new Date();

      // Insert the movie into the database
      const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

      const updateVote = await voteDataMapper.update({ id:userId }, { id: movieId, updated_at });

      res.json({ status: 'success', data: { insertIntoMovie, updateVote} });

    } catch (error) {
      console.error('Error changing vote:', error);
      errorHandler._500('Error changing vote', req, res);
    };
  },

  async delete(req, res) {
    debug('vote delete controller called');

    try {
      const id = req.params.id;

      const deleteVote = await voteDataMapper.delete(id);

      res.json({ status: 'success' });

    } catch (error) {
      errorHandler._500('Error deleting vote', req, res);
    };
  },

  async movieSelection(req, res) {
    debug('vote movieSelection controller called');

    try {
      const id = req.params.id;

      const selection = await voteDataMapper.movieSelection(id);

      res.json({ status: 'success', data: selection });

    } catch (error) {
      errorHandler._500('Error displaying the vote', req, res);
    };
  },
};

module.exports = voteController;