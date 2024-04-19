const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for popular movies
async function fetchPopularMovie(req, res) {

    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const cacheKey = `popular_movies_${page}`; // Generating a cache key based on the page number for popular movies

    try {
        // Attempting to retrieve popular movies data from the cache
        const cachedMovies = cache.get(cacheKey);

        // If popular movies data is found in the cache, return it
        if (cachedMovies) {
            console.log('Popular movies retrieved from cache');
            return res.json(cachedMovies);
        }

        // If popular movies data is not found in the cache, fetch it from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/popular?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            debug('Network error or invalid response');
            errorHandler._500(error, req, res);
        };

        // Parse the response data into JSON format
        const popularMovies = await response.json();
        const movies = popularMovies.results;

        // Fetch providers for each movie
        const moviesWithProvidersPromises = movies.map(async movie => {
            const providers = await fetchProviders(movie.id);
            movie.providers = providers;
            return movie;
        });

        // Wait for all movies with providers to be fetched
        const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

        // Cache the popular movies data for future use
        cache.set(cacheKey, {
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });

        // Send the popular movies data in the response along with current page and total pages
        res.json({
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });
    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        debug('Error fetching popular movies:', error);
        errorHandler._500(error, req, res);
    };
};

module.exports = fetchPopularMovie;