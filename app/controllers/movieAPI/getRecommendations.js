const debug = require('debug')('app:controller');
require('dotenv').config();

const errorHandler = require('../../service/error.js');
const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Retrieves recommended movies based on an id
async function getRecommendations(movieId, language, page) {
  const cacheKey = `recommendations_${movieId}_${page}`;

  try {
    // Check if recommendations are cached
      const cachedRecommendations = cache.get(cacheKey);

      if (cachedRecommendations) {
          console.log('Recommendations retrieved from cache');
          return cachedRecommendations;
      }

      // Fetch recommendations from TMDB API
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/recommendations?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

      if (!response.ok) {
        debug('Network error or invalid response');
        errorHandler._500(error, req, res);
      }

      const recommendation = await response.json();
      const recommendationResults = recommendation.results;

      // Fetch providers for each recommended movie asynchronously
      const recommendationsWithProvidersPromises = recommendationResults.map(async movie => {
          const providers = await fetchProviders(movie.id);
          movie.providers = providers;
          return movie;
      });

      // Wait for all provider fetches to complete
      const recommendationsWithProviders = await Promise.all(recommendationsWithProvidersPromises);

      // Cache recommendations and metadata
      cache.set(cacheKey, {
          movies: recommendationsWithProviders,
          currentPage: page,
          totalPages: recommendation.total_pages
      });

      // Return recommendations and metadata
      return {
          movies: recommendationsWithProviders,
          currentPage: page,
          totalPages: recommendation.total_pages
      };
  } catch (error) {
    debug('Error fetching recommendations:', error);
    errorHandler._500(error, req, res);
  };
};

module.exports = getRecommendations;