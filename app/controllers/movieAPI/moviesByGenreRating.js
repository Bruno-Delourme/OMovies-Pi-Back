const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search films by genre and rating
async function fetchMoviesByGenreRating(req, res) {

  // Extracting the genre from the request parameters
  const genre = req.params.genre;
  const language = 'fr-FR'; // Setting the language for the API request
  const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
  const cacheKey = `recommendations_rating_${genre}_${page}`; // Generating a cache key based on the genre and page number

  try {
      // Attempting to retrieve movies data from the cache
      const cachedMovies = cache.get(cacheKey);

      // If movies data is found in the cache, return it
      if (cachedMovies) {
          console.log(`Données récupérées du cache: ${genre}`);

          return res.json({
              movies: cachedMovies,
              currentPage: page,
              totalPages: cachedMovies.total_pages
          });
      };

      // If movies data is not found in the cache, fetch genre data from the TMDB API
      const genreResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.API_TMDB_KEY}&language=${language}`);

      // If there's an issue with the network or the response is not valid, throw an error
      if (!genreResponse.ok) {
          debug('Network error or invalid response while retrieving genres');
          errorHandler._500(error, req, res);
      };

      // Parse the genre response into JSON format
      const genreData = await genreResponse.json();

      // Find the genre corresponding to the provided genre name
      const selectedGenre = genreData.genres.find(g => g.name.toLowerCase() === genre.toLowerCase());

      // If the genre is not found, throw an error
      if (!selectedGenre) {
        debug('Genre not found');
        errorHandler._500(error, req, res);
      };

      // Fetch movies data for the specified genre from the TMDB API
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&with_genres=${selectedGenre.id}&language=${language}&page=${page}&sort_by=vote_average.desc`);
    
      // If there's an issue with the network or the response is not valid, throw an error
      if (!response.ok) {
        debug('Network error or invalid response');
        errorHandler._500(error, req, res);
      }

      // Parse the movies response into JSON format
      const moviesData = await response.json();
      const movies = moviesData.results;

      // Fetch details and providers for each movie in the genre
      const moviesWithDetailsPromises = movies.map(async movie => {
          const movieDetailsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.API_TMDB_KEY}&language=${language}`);
          if (movieDetailsResponse.ok) {
              const movieDetails = await movieDetailsResponse.json();
              movie.title = movieDetails.title; // Add title to the movie object
              movie.genres = movieDetails.genres.map(genre => genre.name); // Add genre names to the movie object
          }

          // Fetch providers for the movie
          const providers = await fetchProviders(movie.id);
          movie.providers = providers;

          return movie;
      });

      // Wait for all movies with details to be fetched
      const moviesWithDetails = await Promise.all(moviesWithDetailsPromises);

      // Cache the movies data for future use
      cache.set(cacheKey, moviesWithDetails);

      // Send the movies data in the response along with current page and total pages
      res.json({
          movies: moviesWithDetails,
          currentPage: page,
          totalPages: moviesData.total_pages
      });

  } catch (error) {
      // If any error occurs during the process, log it and send an error response
      debug('Error fetching movies by genre and rating:', error);
      errorHandler._500(error, req, res);
  };
};

module.exports = fetchMoviesByGenreRating;