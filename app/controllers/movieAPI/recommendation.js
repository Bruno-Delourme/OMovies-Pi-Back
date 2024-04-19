const debug = require('debug')('app:controller');
require('dotenv').config();

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
    console.error('Error fetching recommendations:', error);
    res.status(500).json({ error: 'Error fetching recommendations.' });
  };
};

module.exports = fetchRecommendation;
