const debug = require('debug')('app:controller');
require('dotenv').config();

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
      const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
      if (providersResponse.ok) {
        const providersData = await providersResponse.json();
        movie.providers = [];
        if (providersData.results.FR) {
          const franceProviders = providersData.results.FR;
          for (const offerType in franceProviders) {
            if (Object.hasOwnProperty.call(franceProviders, offerType)) {
              const offers = franceProviders[offerType];
              if (Array.isArray(offers)) {
                offers.forEach(provider => {
                  if (provider.provider_name) {
                    movie.providers.push(provider.provider_name);
                  }
                });
              } else {
                if (offers.provider_name) {
                  movie.providers.push(offers.provider_name);
                }
              }
            }
          }
        }
      }
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

module.exports = {
  getRecommendations,
};