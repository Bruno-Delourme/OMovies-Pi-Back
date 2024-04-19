const debug = require('debug')('app:controller');
require('dotenv').config();

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for a movie by id
async function fetchMovieById(req, res) {

  // Extracting the movie id from the request parameters
    const movieId = req.params.id;
    // Creating a cache key for the movie using its id
    const cacheKey = `movie_${movieId}`;

    try {
        // Attempting to retrieve the movie from the cache
        const cachedMovie = cache.get(cacheKey);

        // If the movie is found in the cache, return it
        if (cachedMovie) {
            console.log('Film récupéré du cache');
            return res.json(cachedMovie);
        }

        // If the movie is not in the cache, fetch it from the external API
        const movieResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!movieResponse.ok) {
            throw new Error('Erreur réseau ou réponse invalide');
        }

        // Parse the movie response into JSON format
        const movie = await movieResponse.json();

        // Fetching credits for the movie from the external API
        const creditsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/credits?api_key=${process.env.API_TMDB_KEY}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!creditsResponse.ok) {
            throw new Error('Erreur réseau ou réponse invalide lors de la récupération des crédits');
        }

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

    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        console.error('Erreur lors de la récupération du film par identifiant:', error);
        res.status(500).json({ error: 'Erreur lors de la récupération du film par identifiant.' });
    }
};

module.exports = fetchMovieById;