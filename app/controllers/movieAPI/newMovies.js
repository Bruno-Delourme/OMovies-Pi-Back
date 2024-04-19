const debug = require('debug')('app:controller');
require('dotenv').config();

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for new movies
async function fetchNewMovies(req, res) {
  
// Setting the language for the API request
  const language = 'fr-FR'; 
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided

    try {
        // Fetching data for new movies from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/now_playing?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            throw new Error('Network error or invalid response');
        };

        // Parse the response data into JSON format
        const newMovies = await response.json();
        const movies = newMovies.results;

        // Fetch providers for each movie
        const moviesWithProvidersPromises = movies.map(async movie => {
            const providers = await fetchProviders(movie.id);
            movie.providers = providers;
            return movie;
        });

        // Wait for all movies with providers to be fetched
        const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

        // Send the movies data in the response along with current page and total pages
        res.json({
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: newMovies.total_pages
        });

    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        console.error('Error fetching new movies:', error);
        res.status(500).json({ error: 'Error fetching new movies.' });
    };
};

module.exports = fetchNewMovies;