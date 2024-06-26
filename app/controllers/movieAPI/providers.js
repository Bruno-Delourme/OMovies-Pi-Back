const debug = require("debug")("app:controller");
const { API_TMDB_BASE_URL, API_TMDB_KEY } = require("../../config/config.js");

const errorHandler = require("../../service/error.js");

async function fetchProviders(movieId) {
  try {
    const providersResponse = await fetch(
      `${API_TMDB_BASE_URL}movie/${movieId}/watch/providers?api_key=${API_TMDB_KEY}&region=FR`
    );

    if (!providersResponse.ok) {
      errorHandler._500(
        "Erreur réseau ou réponse invalide lors de la récupération des plateformes de visionnage",
        req,
        res
      );
    }

    const providersData = await providersResponse.json();

    const movieProviders = [];

    // Check if information is available for France
    if (providersData.results.FR) {
      const franceProviders = providersData.results.FR;

      // Browse the keys of the franceProviders object
      for (const offerType in franceProviders) {
        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
          const offers = franceProviders[offerType];

          // Check if the offer is an array
          if (Array.isArray(offers)) {
            // Add the names of content providers for each offer type
            offers.forEach((provider) => {
              if (provider.provider_name) {
                movieProviders.push(provider.provider_name);
              }
            });
          } else {
            // If it is not an array, add the supplier name directly
            if (offers.provider_name) {
              movieProviders.push(offers.provider_name);
            }
          }
        }
      }
    }

    return movieProviders;
  } catch {
    return (movieProviders = []);
  }
}

module.exports = fetchProviders;
