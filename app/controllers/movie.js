const debug = require('debug')('app:controller');
require('dotenv').config();

const movieController = {

async fetchMovieById(req, res) {

  const movieId = req.params.id;
  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur de réseau ou réponse non valide');
    };
    const movie = await response.json();
    
    res.json(movie);

  } catch (error) {
    debug('Erreur lors de la récupération des films par id :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par id.' });
  };
},

async fetchMoviesByKeyword(req, res) {

  const keyword = req.params.keyword;
  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}search/keyword?api_key=${process.env.API_TMDB_KEY}&query=${keyword}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };
    const movies = await response.json();

    res.json(movies);

  } catch (error) {
    debug('Erreur lors de la récupération des films par mots clefs :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par mots clefs.' });
  };
},

async fetchMovieByTitle(req, res) {

    const movieTitle = req.params.title;
    try {
      const encodedTitle = encodeURIComponent(movieTitle);
      
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}search/movie?api_key=${process.env.API_TMDB_KEY}&query=${encodedTitle}&language=fr-FR`);
      
      if (!response.ok) {
        throw new Error('Erreur de réseau ou réponse non valide');
      };
      
      const movie = await response.json();
      res.json(movie)

    } catch (error) {
      debug('Erreur lors de la récupération des films par titre :', error);
      throw new Error('Erreur lors de la récupération des films par titre.');
    };
},

async fetchActorDetails(req, res) {
  
  const actor = req.params.actor;
  
  try {
    const encodedActor = encodeURIComponent(actor);
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}search/person?api_key=${process.env.API_TMDB_KEY}&query=${encodedActor}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };
    const actorDetails = await response.json();

    res.json(actorDetails);

  } catch (error) {
    debug('Erreur lors de la récupération des films par acteur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par acteur.' });
  };
},

async fetchNewMovies(_, res) {

  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/now_playing?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };
    const newMovies = await response.json();

    res.json(newMovies);

  } catch (error) {
    debug('Erreur lors de la récupération des nouveaux films :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des nouveaux films.' });
  };
},

async fetchBySearchBar(req, res) {

  const searchTerm = req.query.query; 

  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm);

    const responseByTitle = await fetch(`${process.env.API_TMDB_BASE_URL}search/movie?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=fr-FR`);

    if (!responseByTitle.ok) {
      throw new Error('Erreur de réseau ou réponse non valide');
    }

    const moviesByTitle = await responseByTitle.json();

    
    
    res.json(moviesByTitle);

  } catch (error) {
    console.error('Erreur lors de la récupération des films par titre ou par acteur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par titre ou par acteur.' });
  }
},

async fetchPopularMovie(_, res) {

  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/popular?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };
    const popularMovies = await response.json();

    res.json(popularMovies);

  } catch (error) {
    debug('Erreur lors de la récupération des films populaires :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films populaires.' })
  };
},

async fetchRecommendation(req, res) {

  const movieId = req.params.id;
  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/recommendations?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };
    const recommendation = await response.json();

    res.json(recommendation);

  } catch (error) {
    debug('Erreur lors de la récupération de la recommendation :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la recommendation.' })
  }
},

};

module.exports = movieController;