const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieAPIController = require('./movieAPI.js');
const favoriteMovieController = require('./favorite_movie.js');
const toReviewController = require('./to_review_movie.js');

module.exports = { 
  userController,
  movieAPIController,
  favoriteMovieController,
  toReviewController
};