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

async fetchMoviesByGenre(req, res) {

  const genre = req.params.genre;
  
  try {
    const genreResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);

    if (!genreResponse.ok) {
      throw new Error('Erreur réseau ou réponse non valide lors de la récupération des genres');
    };

    const genreData = await genreResponse.json();
    const genreId = genreData.genres.find(g => g.name.toLowerCase() === genre.toLowerCase())?.id;

    if (!genreId) {
      throw new Error('Genre non trouvé');
    };

    const response = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&language=fr-FR&sort_by=popularity.desc&with_genres=${genreId}`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide lors de la récupération des films');
    };

    const moviesData = await response.json();
    const movies = moviesData.results;

    res.json(movies);

  } catch (error) {
    console.error('Erreur lors de la récupération des films par genre :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par genre.' });
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
    const moviesByTitle = moviesByTitleData.results.map(movie => ({ title: movie.title, poster_path: movie.poster_path }));
    const actors = moviesByActorData.results.map(actor => actor.name);

    // Retrieve the films in which the actors starred
    const moviesByActorPromises = moviesByActorData.results.map(async actor => {
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
      moviesByTitle,
      moviesByGenre,
      actors,
      moviesByActor
    };
console.log(combinedResults);
    res.json(combinedResults);

  } catch (error) {
    console.error('Erreur lors de la récupération des films par titre, genre ou acteur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par titre, genre ou acteur.' });
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