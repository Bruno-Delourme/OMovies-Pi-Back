const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieAPIController = require('./movieAPI/movieAPI.js');
const favoriteMovieController = require('./favorite_movie.js');
const toReviewController = require('./to_review_movie.js');
const likeController = require('./like.js');
const commentController = require('./comment.js');

module.exports = { 
  userController,
  movieAPIController,
  favoriteMovieController,
  toReviewController,
  likeController,
  commentController
};