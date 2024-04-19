const debug = require('debug')('app:controller');
require('dotenv').config();

const errorHandler = require('../../service/error.js');
const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

async function getRecommendations(movieId, language, page) {
  const cacheKey = `recommendations_${movieId}_${page}`;

  try {
      const cachedRecommendations = cache.get(cacheKey);

      if (cachedRecommendations) {
          console.log('Recommendations retrieved from cache');
          return cachedRecommendations;
      }

      const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/recommendations?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

      if (!response.ok) {
          throw new Error('Network error or invalid response');
      }

      const recommendation = await response.json();
      const recommendationResults = recommendation.results;

      const recommendationsWithProvidersPromises = recommendationResults.map(async movie => {
          const providers = await fetchProviders(movie.id);
          movie.providers = providers;
          return movie;
      });

      const recommendationsWithProviders = await Promise.all(recommendationsWithProvidersPromises);

      cache.set(cacheKey, {
          movies: recommendationsWithProviders,
          currentPage: page,
          totalPages: recommendation.total_pages
      });

      return {
          movies: recommendationsWithProviders,
          currentPage: page,
          totalPages: recommendation.total_pages
      };
  } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
  };
};

module.exports = getRecommendations;