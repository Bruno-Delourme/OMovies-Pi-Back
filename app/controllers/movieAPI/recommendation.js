const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const getRecommendations = require('../movieAPI/getRecommendations.js');

 // Gives movie recommendations based on a movie's ID
 async function fetchRecommendation(req, res) {

  const movieId = req.params.id;
  const language = 'fr-FR';
  const page = req.query.page || 1;

  const recommendation = await getRecommendations(movieId, language, page);
  res.json(recommendation);
};

module.exports = fetchRecommendation;
