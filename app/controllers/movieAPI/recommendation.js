const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const getRecommendations = require('../movieAPI/getRecommendations.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

 // Gives movie recommendations based on a movie's ID
 async function fetchRecommendation(req, res) {
  const movieId = req.params.id;
  const language = 'fr-FR';
  const page = req.query.page || 1;

  try {
    const recommendation = await getRecommendations(movieId, language, page);
    res.json(recommendation);

  } catch (error) {
    debug('Error fetching recommendations:', error);
    errorHandler._500(error, req, res);
  };
};

module.exports = fetchRecommendation;
