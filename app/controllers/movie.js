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

    const moviesData = await response.json();
    const movies = moviesData.results;

    const moviesWithDetails = await Promise.all(movies.map(async (movie) => {
      const detailsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);
      const details = await detailsResponse.json();
      return details;
    }));

    res.json(moviesWithDetails);

  } catch (error) {
    debug('Erreur lors de la récupération des films par mots clés :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par mots clés.' });
  }
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
    const responseByKeyword = await fetch(`${process.env.API_TMDB_BASE_URL}search/keyword?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=fr-FR`);
    const responseByActor = await fetch(`${process.env.API_TMDB_BASE_URL}search/person?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=fr-FR`);

    if (!responseByTitle.ok || !responseByKeyword.ok || !responseByActor.ok) {
      throw new Error('Erreur de réseau ou réponse non valide');
    }

    const moviesByTitle = await responseByTitle.json();
    const moviesByKeyword = await responseByKeyword.json();
    const actors = await responseByActor.json();
    

    const moviesByTitleNames = moviesByTitle.results.map(movie => ({ title: movie.title, poster_path: movie.poster_path }));
    
    const moviesNamesByKeyword = moviesByKeyword.results.map(keyword => keyword.name);

    const moviesByActorPromises = actors.results.map(async actor => {
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}person/${actor.id}/movie_credits?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);
      if (response.ok) {
        const credits = await response.json();
        return credits.cast.map(movie => ({ title: movie.title, poster_path: movie.poster_path }));
      } else {
        return [];
      }
    });
    const moviesByActor = await Promise.all(moviesByActorPromises);

    const combinedResults = {
      moviesByTitle: moviesByTitleNames,
      moviesByKeyword: moviesNamesByKeyword,
      moviesByActor: moviesByActor
    };
    
    res.json(combinedResults);

  } catch (error) {
    console.error('Erreur lors de la récupération des films par titre, mot-clé ou acteur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par titre, mot-clé ou acteur.' });
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