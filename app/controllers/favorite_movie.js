const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const favoriteMovieDataMapper = require('../models/favorite_movie.js');
const movieDBDataMapper = require('../models/movieDB.js');

const favoriteMovieController = {

// Allows you to insert a movie into the favorites list
  async insertIntoFavorite(req, res) {
    debug('list insertIntoFavorite controller called');
 
    const movieId = req.body.id;
    const title = req.body.title;
    const poster_path = req.body.poster_path;
    const overview = req.body.overview;
    
    const userId = req.params.id;

    if (!movieId || !title || !overview) {
      return errorHandler._400('Incomplete data', req, res);
    };

    const picture = poster_path || 'No poster';

    // Insert the movie into the database
    const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

    // Insert the movie into the user's favorites list
    const insertIntoFavorite = await favoriteMovieDataMapper.insertIntoFavorite({ id: userId }, { id: movieId });
        
    res.json({ status: 'success', data: { insertIntoMovie, insertIntoFavorite} });
  },

// Allows you to view movies from the favorites list
  async showFavorite(req, res) {
    debug('favorite show controller called');

    const id = req.params.id;

    // Shows the user's list of favorites
    const favorite = await favoriteMovieDataMapper.showFavorite(id);

    res.json({ status: 'success', data: favorite });
  },

  async showNewFavorite(req, res) {
    debug('Newfavorite show controller called');

    const id = req.params.id;

    // Shows the user's list of favorites
    const favorite = await favoriteMovieDataMapper.showNewFavorite(id);

    res.json({ status: 'success', data: favorite });
  },

  // Allows you to delete a film from the list of favorite films
  async deleteFromFavorite(req, res) {
    debug('list delete controller called');

    const userId = req.params.id;
    const movieId = req.body.id;

    // Removes a movie from the user's favorites list
    const deleteFromFavorite = await favoriteMovieDataMapper.deleteFromFavorite({id: userId}, {id: movieId});

    res.json({ status: 'success' });
  },
};

module.exports = favoriteMovieController;