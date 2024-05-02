const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const voteDataMapper = require('../models/vote.js');
const movieDBDataMapper = require('../models/movieDB.js');

const voteController = {

  async create(req, res) {
    debug('vote create controller called');

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
  },

  async showVote(req, res) {
    debug('vote show controller called');

    const id = req.params.id;

    const vote = await voteDataMapper.show(id);

    res.json({ status: 'success', data: vote });
  },

  async updateVote(req, res) {
    debug('vote update controller called');

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
  },

  async delete(req, res) {
    debug('vote delete controller called');

    const id = req.params.id;

    const deleteVote = await voteDataMapper.delete(id);

    res.json({ status: 'success' });
  },

  async movieSelection(req, res) {
    debug('vote movieSelection controller called');

    const groupId = req.params.id;

    const updated_at = new Date(); // Getting the current date for the updated_at field

    const selection = await voteDataMapper.movieSelection({ id: groupId, updated_at });

    res.json({ status: 'success', data: selection });
  },

  async showMovieSelection(req, res) {
    debug('show movieSelection controller called');

    const groupId = req.params.id;

    const selection = await voteDataMapper.showMovieSelection({ id: groupId });

    res.json({ status: 'success', data: selection });
  },
};

module.exports = voteController;