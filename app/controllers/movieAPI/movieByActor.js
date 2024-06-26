const debug = require("debug")("app:controller");
const { API_TMDB_BASE_URL, API_TMDB_KEY } = require("../../config/config.js");
const errorHandler = require("../../service/error.js");

const fetchProviders = require("./providers.js");

const NodeCache = require("node-cache");
const cache = new NodeCache({ stdTTL: 604800 });

// Search for a movie by actor
async function fetchMoviesByActor(req, res) {
  // Extracting the actor search term from the request parameters
  const searchTerm = req.params.actor;
  const language = "fr-FR"; // Setting the language for the API request
  const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
  const pageSize = 20;
  const cacheKey = `actor_${encodeURIComponent(searchTerm)}_${page}`; // Generating a cache key based on the actor search term and page number

  // Attempting to retrieve movies data from the cache
  const cachedMovies = cache.get(cacheKey);

  // If movies data is found in the cache, return it
  if (cachedMovies) {
    return res.json({
      movies: cachedMovies.movies,
      currentPage: cachedMovies.currentPage,
      totalPages: cachedMovies.totalPages,
    });
  }

  // If movies data is not found in the cache, fetch data from the TMDB API based on the actor search term
  const encodedSearchTerm = encodeURIComponent(searchTerm);
  const responseByActor = await fetch(
    `${API_TMDB_BASE_URL}search/person?api_key=${API_TMDB_KEY}&query=${encodedSearchTerm}&language=${language}`
  );

  // If there's an issue with the network or the response is not valid, throw an error
  if (!responseByActor.ok) {
    errorHandler._500("Network error or invalid response", req, res);
  }

  // Parse the actor data response into JSON format
  const actorsData = await responseByActor.json();

  // Extract movies data for each actor asynchronously
  const moviesByActorPromises = actorsData.results.map(async (actor) => {
    const response = await fetch(
      `${API_TMDB_BASE_URL}person/${actor.id}/movie_credits?api_key=${API_TMDB_KEY}&language=${language}&page=${page}`
    );

    if (response.ok) {
      const credits = await response.json();

      // Calculating the start and end index for pagination
      const startIndex = pageSize;
      const endIndex = startIndex + pageSize;

      // Paginating the credits data
      const paginatedCredits = credits.cast.slice(startIndex, endIndex);

      // Fetch providers for each movie
      const moviesWithProvidersPromises = paginatedCredits.map(
        async (movie) => {
          const providers = await fetchProviders(movie.id);
          movie.providers = providers;
          return movie;
        }
      );

      // Wait for all movies with providers to be fetched
      const moviesWithProviders = await Promise.all(
        moviesWithProvidersPromises
      );

      // Return the paginated credits with providers
      return moviesWithProviders;
    } else {
      return [];
    }
  });
  // Await for all movies data by actors to be fetched
  const moviesByActor = await Promise.all(moviesByActorPromises);

  // Flatten the array of arrays into a single array
  const allMovies = moviesByActor.flat();

  // Filter adult films
  const filteredMovies = req.filterAdult
    ? allMovies.filter((movie) => !movie.adult)
    : allMovies;

  // Cache the combined movies data for future use
  cache.set(cacheKey, {
    movies: filteredMovies,
    currentPage: page,
    totalPages: actorsData.total_pages,
  });

  // Send the combined movies data in the response
  res.json({
    movies: filteredMovies,
    currentPage: page,
    totalPages: actorsData.total_pages,
  });
}

module.exports = fetchMoviesByActor;
