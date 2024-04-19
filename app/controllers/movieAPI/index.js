const debug = require('debug')('app:controller');

const fetchMovieById = require('./movieById.js');
const fetchMoviesByGenre = require('./moviesByGenre.js');
const fetchMoviesByGenreRating = require('./moviesByGenreRating.js');
const fetchMovieByTitle = require('./movieByTitle.js');
const fetchMoviesByActor = require('./movieByActor.js');
const fetchNewMovies = require('./newMovies.js');
const fetchBySearchBar = require('./searchBar.js');
const fetchPopularMovie = require('./popularMovies.js');
const fetchRecommendation = require('./recommendation.js');
const fetchRecommendationWithRandomMovie = require('./recommendationRandom.js');

module.exports = {
  fetchMovieById,
  fetchMoviesByGenre,
  fetchMoviesByGenreRating,
  fetchMovieByTitle,
  fetchMoviesByActor,
  fetchNewMovies,
  fetchBySearchBar,
  fetchPopularMovie,
  fetchRecommendation,
  fetchRecommendationWithRandomMovie
};