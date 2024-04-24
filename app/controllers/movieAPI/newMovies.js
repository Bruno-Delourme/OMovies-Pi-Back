const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for new movies
async function fetchNewMovies(req, res) {
  
// Setting the language for the API request
  const language = 'fr-FR'; 
  const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
  const pageSize = 20;
  const cacheKey = `new movies_${page}`;

    try {
        // Attempting to retrieve movies data from the cache
        const cachedMovies = cache.get(cacheKey);
        // If movies data is found in the cache, return it
        if (cachedMovies) {
            console.log('Movies by actor retrieved from cache');
            return res.json({
                movies: cachedMovies.movies,
                currentPage: cachedMovies.currentPage,
                totalPages: cachedMovies.totalPages
            });
        };

        // Fetching data for new movies from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/now_playing?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            debug('Network error or invalid response');
            errorHandler._500(error, req, res);
        };

        // Parse the response data into JSON format
        const newMovies = await response.json();
        const movies = newMovies.results;
        const totalPages = newMovies.total_pages;

        // Fetch providers for each movie
        const moviesWithProvidersPromises = movies.map(async movie => {
            const providers = await fetchProviders(movie.id);
            movie.providers = providers;
            return movie;
        });

        // Wait for all movies with providers to be fetched
        const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

        // Filter adult films
        const filteredMovies = req.filterAdult ? moviesWithProviders.filter(movie => !movie.adult) : moviesWithProviders;

        // Cache the combined movies data for future use
        cache.set(cacheKey, {
            movies: filteredMovies,
            currentPage: page,
            totalPages: totalPages
    });

        // Send the movies data in the response along with current page and total pages
        res.json({
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: totalPages
        });

    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        debug('Error fetching new movies:', error);
        errorHandler._500(error, req, res);
    };
};

module.exports = fetchNewMovies;