const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const recommendationDataMapper = require('../../models/recommendation.js');
const getRecommendations = require('../movieAPI/getRecommendations.js');

// Allows you to recommend a movie based on the random id of a movie in the favorites list
async function fetchRecommendationWithRandomMovie(req, res) {
  const userId = req.params.id;

  
  const randomFavoriteMovie = await recommendationDataMapper.getRandomFavoriteMovieId(userId);
  const recommendation = await getRecommendations(randomFavoriteMovie, 'fr-FR', req.query.page || 1);

  // Filter adult films
  const filteredMovies = req.filterAdult ? recommendation.filter(movie => !movie.adult) : recommendation;
    
  res.json(filteredMovies);
};

module.exports = fetchRecommendationWithRandomMovie;