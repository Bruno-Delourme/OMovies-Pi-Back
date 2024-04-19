const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../../service/error.js');

const fetchProviders = require('./providers.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

// Search for movies in a search bar
async function fetchBySearchBar(req, res) {

  const searchTerm = req.query.query;

  try {
    // Search by title
    const encodedSearchTerm = encodeURIComponent(searchTerm);
    const responseByTitle = await fetch(`${process.env.API_TMDB_BASE_URL}search/movie?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=fr-FR`);

    // Search by genre
    const genreResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);
    if (!genreResponse.ok) {
      throw new Error('Erreur réseau ou réponse non valide lors de la récupération des genres');
    }
    const genreData = await genreResponse.json();
    let genreId;
    genreData.genres.forEach(genre => {
      if (genre.name.toLowerCase() === searchTerm.toLowerCase()) {
        genreId = genre.id;
      }
    });

    // Search by actor
    const responseByActor = await fetch(`${process.env.API_TMDB_BASE_URL}search/person?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=fr-FR`);

    // Checking answers
    if (!responseByTitle.ok || !responseByActor.ok) {
      throw new Error('Erreur de réseau ou réponse non valide');
    }

    // Retrieve the answers
    const moviesByTitleData = await responseByTitle.json();
    const moviesByActorData = await responseByActor.json();
    
    // Filter results by gender
    let moviesByGenre = [];
    if (genreId) {
      const responseByGenre = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=${genreId}`);
      if (responseByGenre.ok) {
        const moviesByGenreData = await responseByGenre.json();
        moviesByGenre = moviesByGenreData.results;
      }
    }

    // Retrieve movies by title and actors
    const moviesByTitle = moviesByTitleData.results.map(movie => ({ id: movie.id, title: movie.title, poster_path: movie.poster_path }));
    const actors = moviesByActorData.results.map(actor => actor.name);

    // Retrieve the films in which the actors starred
    const moviesByActorPromises = moviesByActorData.results.map(async actor => {
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}person/${actor.id}/movie_credits?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);
      if (response.ok) {
        const credits = await response.json();
        return credits.cast.map(movie => ({ id: movie.id, title: movie.title, poster_path: movie.poster_path }));
      } else {
        return [];
      }
    });
    const moviesByActor = await Promise.all(moviesByActorPromises);

    const combinedResults = {
      moviesByTitle,
      moviesByGenre,
      actors,
      moviesByActor
    };
  
    res.json(combinedResults);

  } catch (error) {
    debug('Erreur lors de la récupération des films par titre, genre ou acteur :', error);
    errorHandler._500(error, req, res);
  };
};

module.exports = fetchBySearchBar;