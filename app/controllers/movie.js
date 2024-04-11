const debug = require('debug')('app:controller');
require('dotenv').config();
const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

const movieController = {

  async fetchMovieById(req, res) {

    // Extracting the movie id from the request parameters
    const movieId = req.params.id;
    // Creating a cache key for the movie using its id
    const cacheKey = `movie_${movieId}`;
  
    try {
      // Attempting to retrieve the movie from the cache
      const cachedMovie = cache.get(cacheKey);
  
      // If the movie is found in the cache, return it
      if (cachedMovie) {
        console.log('Movie retrieved from cache');
        return res.json(cachedMovie);
      }
  
      // If the movie is not in the cache, fetch it from the external API
      const movieResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}?api_key=${process.env.API_TMDB_KEY}&language=fr-FR`);
  
      // If there's an issue with the network or the response is not valid, throw an error
      if (!movieResponse.ok) {
        throw new Error('Network error or invalid response');
      }
  
      // Parse the movie response into JSON format
      const movie = await movieResponse.json();
  
      // Fetching credits for the movie from the external API
      const creditsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/credits?api_key=${process.env.API_TMDB_KEY}`);
  
      // If there's an issue with the network or the response is not valid, throw an error
      if (!creditsResponse.ok) {
        throw new Error('Network error or invalid response while fetching credits');
      }
  
      // Parse the credits response into JSON format
      const credits = await creditsResponse.json();
  
      // Add credits information to the movie object
      movie.credits = credits;
  
      // Store the movie in the cache for future use
      cache.set(cacheKey, movie);
  
      // Send the movie data in the response
      res.json(movie);
  
    } catch (error) {
      // If any error occurs during the process, log it and send an error response
      console.error('Error fetching movie by id:', error);
      res.status(500).json({ error: 'Error fetching movie by id.' });
    }
  },

  async fetchMoviesByGenre(req, res) {
    
    // Extracting the genre from the request parameters
    const genre = req.params.genre;
    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const cacheKey = `${genre}_${page}`; // Generating a cache key based on the genre and page number
  
    try {
      // Attempting to retrieve movies data from the cache
      const cachedMovies = cache.get(cacheKey);
  
      // If movies data is found in the cache, return it
      if (cachedMovies) {
        console.log(`Data retrieved from cache: ${genre}`);
  
        return res.json({
          movies: cachedMovies,
          currentPage: page,
          totalPages: cachedMovies.total_pages
        });
      }
  
      // If movies data is not found in the cache, fetch genre data from the TMDB API
      const genreResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/genre/movie/list?api_key=${process.env.API_TMDB_KEY}&language=${language}`);
  
      // If there's an issue with the network or the response is not valid, throw an error
      if (!genreResponse.ok) {
        throw new Error('Network error or invalid response while fetching genres');
      }
  
      // Parse the genre response into JSON format
      const genreData = await genreResponse.json();
  
      // Find the genre id corresponding to the provided genre name
      const genreId = genreData.genres.find(g => g.name.toLowerCase() === genre.toLowerCase())?.id;
  
      // If the genre id is not found, throw an error
      if (!genreId) {
        throw new Error('Genre not found');
      }
  
      // Fetch movies data for the specified genre from the TMDB API
      const response = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&language=${language}&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`);
      
      // If there's an issue with the network or the response is not valid, throw an error
      if (!response.ok) {
        throw new Error('Network error or invalid response while fetching movies');
      }
  
      // Parse the movies response into JSON format
      const moviesData = await response.json();
      const movies = moviesData.results;
  
      // Cache the movies data for future use
      cache.set(cacheKey, movies);
  
      // Send the movies data in the response along with current page and total pages
      res.json({
        movies: movies,
        currentPage: page,
        totalPages: moviesData.total_pages
      });
  
    } catch (error) {
      // If any error occurs during the process, log it and send an error response
      console.error('Error fetching movies by genre:', error);
      res.status(500).json({ error: 'Error fetching movies by genre.' });
    }
  },

async fetchMovieByTitle(req, res) {

    const movieTitle = req.params.title;
    const language = 'fr-FR';
    const page = req.query.page || 1;
    const cacheKey = `movie_${encodeURIComponent(movieTitle)}_${page}`;

    try {
        const cachedMovies = cache.get(cacheKey);

        if (cachedMovies) {
            console.log('Films récupérés du cache');

            return res.json({
              movies: cachedMovies,
              currentPage: page,
              totalPages: cachedMovies.total_pages
          });
        };

        const response = await fetch(`${process.env.API_TMDB_BASE_URL}search/movie?api_key=${process.env.API_TMDB_KEY}&query=${encodeURIComponent(movieTitle)}&language=${language}&page=${page}`);
        
        if (!response.ok) {
            throw new Error('Erreur de réseau ou réponse non valide');
        };

        const movieData = await response.json();
        const movies = movieData.results;

        cache.set(cacheKey, {
            movies: movies,
            currentPage: page,
            totalPages: movieData.total_pages
        });

        res.json({
            movies: movies,
            currentPage: page,
            totalPages: movieData.total_pages
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des films par titre :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des films par titre.' });
    }
},

async fetchMoviesByActor(req, res) {
  
    const searchTerm = req.params.actor;
    const language = 'fr-FR';
    const page = req.query.page || 1;
    const cacheKey = `actor_${encodeURIComponent(searchTerm)}_${page}`;

    try {
        const cachedMovies = cache.get(cacheKey);

        if (cachedMovies) {
            console.log('Films récupérés du cache');
            return res.json(cachedMovies);
        };

        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const responseByActor = await fetch(`${process.env.API_TMDB_BASE_URL}search/person?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=${language}`);
        
        if (!responseByActor.ok) {
            throw new Error('Erreur de réseau ou réponse non valide');
        };

        const actorsData = await responseByActor.json();

        const moviesByActorPromises = actorsData.results.map(async actor => {
            const response = await fetch(`${process.env.API_TMDB_BASE_URL}person/${actor.id}/movie_credits?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);
            
            if (response.ok) {
                const credits = await response.json();
                return credits.cast.map(movie => ({ title: movie.title, poster_path: movie.poster_path }));

            } else {
                return [];
            }
        });

        const moviesByActor = await Promise.all(moviesByActorPromises);

        const allMovies = moviesByActor.reduce((acc, movies) => acc.concat(movies), []);

        cache.set(cacheKey, allMovies);

        res.json(allMovies);

    } catch (error) {
        console.error('Erreur lors de la récupération des films par acteur :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des films par acteur.' });
    };
},

async fetchNewMovies(req, res) {

  const language = 'fr-FR';
  const page = req.query.page || 1;

  try {
    const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/now_playing?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

    if (!response.ok) {
      throw new Error('Erreur réseau ou réponse non valide');
    };

    const newMovies = await response.json();
    const movies = newMovies.results;

    res.json({
      movies: movies,
      currentPage: page,
      totalPages: newMovies.total_pages
    });

  } catch (error) {
    console.error('Erreur lors de la récupération des nouveaux films :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des nouveaux films.' });
  }
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
  
    res.json(combinedResults);

  } catch (error) {
    console.error('Erreur lors de la récupération des films par titre, genre ou acteur :', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des films par titre, genre ou acteur.' });
  }
},

async fetchPopularMovie(req, res) {

  const language = 'fr-FR';
    const page = req.query.page || 1;
    const cacheKey = `popular_movies_${page}`;

    try {
        const cachedMovies = cache.get(cacheKey);
        if (cachedMovies) {
            console.log('Films populaires récupérés du cache');
            return res.json(cachedMovies);
        }

        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/popular?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);
        if (!response.ok) {
            throw new Error('Erreur réseau ou réponse non valide');
        };

        const popularMovies = await response.json();
        const movies = popularMovies.results;

        cache.set(cacheKey, {
            movies: movies,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });

        res.json({
            movies: movies,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des films populaires :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des films populaires.' });
    }
},

async fetchRecommendation(req, res) {

  const movieId = req.params.id;
    const language = 'fr-FR';
    const page = req.query.page || 1;
    const cacheKey = `recommendations_${movieId}_${page}`;

    try {
        const cachedRecommendations = cache.get(cacheKey);

        if (cachedRecommendations) {
            console.log('Recommandations récupérées du cache');

            return res.json({
            recommendations: cachedRecommendations,
            currentPage: page,
            totalPages: cachedRecommendations.total_pages
        });
        };

        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/recommendations?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);
        
        if (!response.ok) {
            throw new Error('Erreur réseau ou réponse non valide');
        };

        const recommendation = await response.json();
        const recommendationResults = recommendation.results;

        cache.set(cacheKey, {
            recommendations: recommendationResults,
            currentPage: page,
            totalPages: recommendation.total_pages
        });

        res.json({
            recommendations: recommendationResults,
            currentPage: page,
            totalPages: recommendation.total_pages
        });

    } catch (error) {
        console.error('Erreur lors de la récupération des recommandations :', error);
        res.status(500).json({ error: 'Erreur lors de la récupération des recommandations.' });
    };
},

};

module.exports = movieController;