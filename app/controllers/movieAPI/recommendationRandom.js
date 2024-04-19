const debug = require('debug')('app:controller');
require('dotenv').config();

const fetchProviders = require('./providers.js');
const getRecommendations = require('../movieAPI/getRecommendations.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Allows you to recommend a movie based on the random id of a movie in the favorites list
async function fetchRecommendationWithRandomMovie(req, res) {
  const userId = req.params.id;

  try {
    const randomFavoriteMovie = await recommendationDataMapper.getRandomFavoriteMovieId(userId);
    const recommendation = await getRecommendations(randomFavoriteMovie, 'fr-FR', req.query.page || 1);
    
    res.json(recommendation);

  } catch (error) {
    debug('Error fetching random favorite movie and calling fetchRecommendation :', error);
    res.status(500).json({ error: 'Error fetching random favorite movie and calling fetchRecommendation.' });
  };
};

module.exports = fetchRecommendationWithRandomMovie;