const debug = require('debug')('app:controller');
const { API_TMDB_BASE_URL, API_TMDB_KEY } = require("../../config/config.js");

const errorHandler = require('../../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for a movie by title
async function fetchMovieByTitle(req, res) {

    // Extracting the movie title from the request parameters
    const movieTitle = req.params.title;
    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const cacheKey = `movie_${encodeURIComponent(movieTitle)}_${page}`; // Generating a cache key based on the movie title and page number

  
    // Attempting to retrieve movies data from the cache
    const cachedMovies = cache.get(cacheKey);

    // If movies data is found in the cache, return it
    if (cachedMovies) {
        return res.json({
            movies: cachedMovies.movies,
            currentPage: cachedMovies.currentPage,
            totalPages: cachedMovies.totalPages
        });
    };

    // If movies data is not found in the cache, fetch movie data from the TMDB API
    const response = await fetch(`${API_TMDB_BASE_URL}search/movie?api_key=${API_TMDB_KEY}&query=${encodeURIComponent(movieTitle)}&language=${language}&page=${page}`);
      
    // If there's an issue with the network or the response is not valid, throw an error
    if (!response.ok) {
        errorHandler._500('Network error or invalid response', req, res);
    };

    // Parse the movie data response into JSON format
    const movieData = await response.json();
    const movies = movieData.results;

    // Fetch providers for each movie
    const moviesWithProvidersPromises = movies.map(async movie => {
        // Fetch providers for the movie
        const providers = await fetchProviders(movie.id);
        movie.providers = providers;
        return movie;
    });

    // Wait for all movies with providers to be fetched
    const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

    // Filter adult films
    const filteredMovies = req.filterAdult ? moviesWithProviders.filter(movie => !movie.adult) : moviesWithProviders;

    // Cache the movies data for future use
    cache.set(cacheKey, {
        movies: filteredMovies,
        currentPage: page,
        totalPages: movieData.total_pages
    });

    // Send the movies data in the response along with current page and total pages
    res.json({
        movies: filteredMovies,
        currentPage: page,
        totalPages: movieData.total_pages
    });
};

module.exports = fetchMovieByTitle;