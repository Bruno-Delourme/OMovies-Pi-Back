const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for a movie by id
async function fetchMovieById(req, res) {

  // Extracting the movie id from the request parameters
    const movieId = req.params.id;
    const language = 'fr-FR'; // Setting the language for the API request
    const cacheKey = `movie_${movieId}`;

    try {
        // Attempting to retrieve the movie from the cache
        const cachedMovie = cache.get(cacheKey);

        // If the movie is found in the cache, return it
        if (cachedMovie) {
            console.log('Movie by id retrieved from cache');
            return res.json(cachedMovie);
        };

        // If the movie is not in the cache, fetch it from the external API
        const movieResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}?api_key=${process.env.API_TMDB_KEY}&language=${language}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!movieResponse.ok) {
            debug('Network error or invalid response');
            errorHandler._500(error, req, res);
        };

        // Parse the movie response into JSON format
        const movie = await movieResponse.json();

        // Fetching credits for the movie from the external API
        const creditsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/credits?api_key=${process.env.API_TMDB_KEY}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (creditsResponse.ok) {   
        // Parse the credits response into JSON format
        const credits = await creditsResponse.json();

        // Call the fetchProviders function to get providers
        const providers = await fetchProviders(movieId);

        // Add providers information to the movie object
        movie.providers = providers;

        // Add credits information to the movie object
        movie.credits = credits;

        // Store the movie in the cache for future use
        cache.set(cacheKey, movie);

        // Send the movie data in the response
        res.json(movie);
};
    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        debug('Error retrieving movie by ID:', error);
        errorHandler._500(error, req, res);
    };
};

module.exports = fetchMovieById;