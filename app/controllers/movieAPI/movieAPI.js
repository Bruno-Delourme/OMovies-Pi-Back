const debug = require('debug')('app:controller');
require('dotenv').config();

const recommendationDataMapper = require('../../models/recommendation.js');
const { getRecommendations } = require('../movieAPI/getRecommendations.js');

const NodeCache = require('node-cache');
const cache = new NodeCache({ stdTTL: 604800 });

const movieController = {

  // Search for a movie by id
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

        // Add viewing platform information
        const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movieId}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
        
        if (!providersResponse.ok) {
            throw new Error('Erreur réseau ou réponse invalide lors de la récupération des plateformes de visionnage');
        }

        const providersData = await providersResponse.json();
        
        movie.providers = [];
        
        // Check if information is available for France
        if (providersData.results.FR) {
          const franceProviders = providersData.results.FR;

          // Browse the keys of the franceProviders object
          for (const offerType in franceProviders) {
              if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                  const offers = franceProviders[offerType];

                  // Check if the offer is an array
                  if (Array.isArray(offers)) {
                      // Add the names of content providers for each offer type
                      offers.forEach(provider => {
                          if (provider.provider_name) {
                              movie.providers.push(provider.provider_name);
                          }
                      });
                  } else {
                      // If it is not a table, add the supplier name directly
                      if (offers.provider_name) {
                          movie.providers.push(offers.provider_name);
                      };
                  };
              };
          };
        };

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
  },

  // Search for a film by genre
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
            throw new Error('Erreur réseau ou réponse invalide lors de la récupération des genres');
        };
  
        // Parse the genre response into JSON format
        const genreData = await genreResponse.json();
  
        // Find the genre corresponding to the provided genre name
        const selectedGenre = genreData.genres.find(g => g.name.toLowerCase() === genre.toLowerCase());
  
        // If the genre is not found, throw an error
        if (!selectedGenre) {
            throw new Error('Genre not found');
        };
  
        // Fetch movies data for the specified genre from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&language=${language}&sort_by=popularity.desc&with_genres=${selectedGenre.id}&page=${page}`);
      
        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            throw new Error('Network error or invalid response while fetching movies');
        }
  
        // Parse the movies response into JSON format
        const moviesData = await response.json();
        const movies = moviesData.results;
  
        // Fetch details for each movie in the genre
        const moviesWithDetailsPromises = movies.map(async movie => {
            const movieDetailsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.API_TMDB_KEY}&language=${language}`);
            if (movieDetailsResponse.ok) {
                const movieDetails = await movieDetailsResponse.json();
                movie.title = movieDetails.title; // Add title to the movie object
                movie.genres = movieDetails.genres.map(genre => genre.name); // Add genre names to the movie object
            };

            // Recover film credits
            const creditsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/movie/${movie.id}/credits?api_key=${process.env.API_TMDB_KEY}&language=${language}`);
            if (creditsResponse.ok) {
            const creditsData = await creditsResponse.json();
            movie.credits = creditsData.cast;
            };

            // Fetch providers for the movie
            const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                movie.providers = [];
                // Check if information is available for France
                if (providersData.results.FR) {
                    const franceProviders = providersData.results.FR;
                    // Browse the keys of the franceProviders object
                    for (const offerType in franceProviders) {
                        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                            const offers = franceProviders[offerType];
                            // Check if the offer is an array
                            if (Array.isArray(offers)) {
                                // Add the names of content providers for each offer type
                                offers.forEach(provider => {
                                    if (provider.provider_name) {
                                        movie.providers.push(provider.provider_name);
                                    }
                                });
                            } else {
                                // If it is not an array, add the provider name directly
                                if (offers.provider_name) {
                                    movie.providers.push(offers.provider_name);
                                };
                            };
                        };
                    };
                };
            }
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
        console.error('Error fetching movies by genre:', error);
        res.status(500).json({ error: 'Error fetching movies by genre.' });
    };
  },

  // Search films by genre and rating
  async fetchMoviesByGenreRating(req, res) {
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
            throw new Error('Erreur réseau ou réponse invalide lors de la récupération des genres');
        };
  
        // Parse the genre response into JSON format
        const genreData = await genreResponse.json();

        // Find the genre corresponding to the provided genre name
        const selectedGenre = genreData.genres.find(g => g.name.toLowerCase() === genre.toLowerCase());

        // If the genre is not found, throw an error
        if (!selectedGenre) {
            throw new Error('Genre not found');
        };
  
        // Fetch movies data for the specified genre from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}/discover/movie?api_key=${process.env.API_TMDB_KEY}&with_genres=${selectedGenre.id}&language=${language}&page=${page}&sort_by=vote_average.desc`);
      
        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            throw new Error('Network error or invalid response while fetching movies');
        }
  
        // Parse the movies response into JSON format
        const moviesData = await response.json();
        const movies = moviesData.results;

        // Fetch details for each movie in the genre
        const moviesWithDetailsPromises = movies.map(async movie => {
            const movieDetailsResponse = await fetch(`${process.env.API_TMDB_BASE_URL}/movie/${movie.id}?api_key=${process.env.API_TMDB_KEY}&language=${language}`);
            if (movieDetailsResponse.ok) {
                const movieDetails = await movieDetailsResponse.json();
                movie.title = movieDetails.title; // Add title to the movie object
                movie.genres = movieDetails.genres.map(genre => genre.name); // Add genre names to the movie object
            }
            // Fetch providers for the movie
            const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                movie.providers = [];
                // Check if information is available for France
                if (providersData.results.FR) {
                    const franceProviders = providersData.results.FR;
                    // Browse the keys of the franceProviders object
                    for (const offerType in franceProviders) {
                        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                            const offers = franceProviders[offerType];
                            // Check if the offer is an array
                            if (Array.isArray(offers)) {
                                // Add the names of content providers for each offer type
                                offers.forEach(provider => {
                                    if (provider.provider_name) {
                                        movie.providers.push(provider.provider_name);
                                    }
                                });
                            } else {
                                // If it is not an array, add the provider name directly
                                if (offers.provider_name) {
                                    movie.providers.push(offers.provider_name);
                                };
                            };
                        };
                    };
                };
            }
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
        console.error('Error fetching movies by genre:', error);
        res.status(500).json({ error: 'Error fetching movies by genre.' });
    };
  },

  // Search for a movie by title
  async fetchMovieByTitle(req, res) {
    
    // Extracting the movie title from the request parameters
    const movieTitle = req.params.title;
    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const cacheKey = `movie_${encodeURIComponent(movieTitle)}_${page}`; // Generating a cache key based on the movie title and page number

    try {
        // Attempting to retrieve movies data from the cache
        const cachedMovies = cache.get(cacheKey);

        // If movies data is found in the cache, return it
        if (cachedMovies) {
            console.log('Movies retrieved from cache');

            return res.json({
                movies: cachedMovies,
                currentPage: page,
                totalPages: cachedMovies.total_pages
            });
        };

        // If movies data is not found in the cache, fetch movie data from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}search/movie?api_key=${process.env.API_TMDB_KEY}&query=${encodeURIComponent(movieTitle)}&language=${language}&page=${page}`);
        
        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            throw new Error('Network error or invalid response');
        };

        // Parse the movie data response into JSON format
        const movieData = await response.json();
        const movies = movieData.results;

        // Fetch providers for each movie
        const moviesWithProvidersPromises = movies.map(async movie => {
            // Fetch providers for the movie
            const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                movie.providers = [];
                // Check if information is available for France
                if (providersData.results.FR) {
                    const franceProviders = providersData.results.FR;
                    // Browse the keys of the franceProviders object
                    for (const offerType in franceProviders) {
                        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                            const offers = franceProviders[offerType];
                            // Check if the offer is an array
                            if (Array.isArray(offers)) {
                                // Add the names of content providers for each offer type
                                offers.forEach(provider => {
                                    if (provider.provider_name) {
                                        movie.providers.push(provider.provider_name);
                                    }
                                });
                            } else {
                                // If it is not an array, add the provider name directly
                                if (offers.provider_name) {
                                    movie.providers.push(offers.provider_name);
                                };
                            };
                        };
                    };
                };
            }
            return movie;
        });
        // Wait for all movies with providers to be fetched
        const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

        // Cache the movies data for future use
        cache.set(cacheKey, {
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: movieData.total_pages
        });

        // Send the movies data in the response along with current page and total pages
        res.json({
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: movieData.total_pages
        });

    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        console.error('Error fetching movies by title:', error);
        res.status(500).json({ error: 'Error fetching movies by title.' });
    }
  },

  // Search for a movie by actor
  async fetchMoviesByActor(req, res) {
    
    // Extracting the actor search term from the request parameters
    const searchTerm = req.params.actor;
    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const pageSize = 20; // Number of results per page
    const cacheKey = `actor_${encodeURIComponent(searchTerm)}_${page}`; // Generating a cache key based on the actor search term and page number
    try {
        // Attempting to retrieve movies data from the cache
        const cachedMovies = cache.get(cacheKey);
        // If movies data is found in the cache, return it
        if (cachedMovies) {
            console.log('Movies retrieved from cache');
            return res.json(cachedMovies);
        };
        // If movies data is not found in the cache, fetch data from the TMDB API based on the actor search term
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const responseByActor = await fetch(`${process.env.API_TMDB_BASE_URL}search/person?api_key=${process.env.API_TMDB_KEY}&query=${encodedSearchTerm}&language=${language}`);
        // If there's an issue with the network or the response is not valid, throw an error
        if (!responseByActor.ok) {
            throw new Error('Network error or invalid response');
        };
        // Parse the actor data response into JSON format
        const actorsData = await responseByActor.json();
        // Extract movies data for each actor asynchronously
        const moviesByActorPromises = actorsData.results.map(async actor => {
            const response = await fetch(`${process.env.API_TMDB_BASE_URL}person/${actor.id}/movie_credits?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);
            if (response.ok) {
                const credits = await response.json();
                // Calculating the start and end index for pagination
                const startIndex = (page - 1) * pageSize;
                const endIndex = startIndex + pageSize;
                // Paginating the credits data
                const paginatedCredits = credits.cast.slice(startIndex, endIndex);
                // Fetch providers for each movie
                const moviesWithProvidersPromises = paginatedCredits.map(async movie => {
                    const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
                    if (providersResponse.ok) {
                        const providersData = await providersResponse.json();
                        movie.providers = [];
                        // Check if information is available for France
                        if (providersData.results.FR) {
                            const franceProviders = providersData.results.FR;
                            // Browse the keys of the franceProviders object
                            for (const offerType in franceProviders) {
                                if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                                    const offers = franceProviders[offerType];
                                    // Check if the offer is an array
                                    if (Array.isArray(offers)) {
                                        // Add the names of content providers for each offer type
                                        offers.forEach(provider => {
                                            if (provider.provider_name) {
                                                movie.providers.push(provider.provider_name);
                                            }
                                        });
                                    } else {
                                        // If it is not an array, add the provider name directly
                                        if (offers.provider_name) {
                                            movie.providers.push(offers.provider_name);
                                        };
                                    };
                                };
                            };
                        };
                    }
                    return movie;
                });
                // Wait for all movies with providers to be fetched
                const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);
                // Return the paginated credits with providers
                return moviesWithProviders;
            } else {
                return [];
            }
        });
        // Await for all movies data by actors to be fetched
        const moviesByActor = await Promise.all(moviesByActorPromises);
        // Flatten the array of arrays into a single array
        const allMovies = moviesByActor.flat();
        // Cache the combined movies data for future use
        cache.set(cacheKey, {
            movies: allMovies,
            currentPage: page,
            totalPages: allMovies.total_pages
        });
        // Send the combined movies data in the response
        res.json({
            movies: allMovies,
            currentPage: page,
            totalPages: allMovies.total_pages
        });
    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        console.error('Error fetching movies by actor:', error);
        res.status(500).json({ error: 'Error fetching movies by actor.' });
    };
  },

  // Search for new movies
  async fetchNewMovies(req, res) {

    const language = 'fr-FR'; // Setting the language for the API request
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
            const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                movie.providers = [];
                // Check if information is available for France
                if (providersData.results.FR) {
                    const franceProviders = providersData.results.FR;
                    // Browse the keys of the franceProviders object
                    for (const offerType in franceProviders) {
                        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                            const offers = franceProviders[offerType];
                            // Check if the offer is an array
                            if (Array.isArray(offers)) {
                                // Add the names of content providers for each offer type
                                offers.forEach(provider => {
                                    if (provider.provider_name) {
                                        movie.providers.push(provider.provider_name);
                                    }
                                });
                            } else {
                                // If it is not an array, add the provider name directly
                                if (offers.provider_name) {
                                    movie.providers.push(offers.provider_name);
                                };
                            };
                        };
                    };
                };
            }
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
  },

  // Search for movies in a search bar
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

  // Search for popular movies
  async fetchPopularMovie(req, res) {

    const language = 'fr-FR'; // Setting the language for the API request
    const page = req.query.page || 1; // Extracting the page number from the query parameters, defaulting to 1 if not provided
    const cacheKey = `popular_movies_${page}`; // Generating a cache key based on the page number for popular movies

    try {
        // Attempting to retrieve popular movies data from the cache
        const cachedMovies = cache.get(cacheKey);

        // If popular movies data is found in the cache, return it
        if (cachedMovies) {
            console.log('Popular movies retrieved from cache');
            return res.json(cachedMovies);
        }

        // If popular movies data is not found in the cache, fetch it from the TMDB API
        const response = await fetch(`${process.env.API_TMDB_BASE_URL}movie/popular?api_key=${process.env.API_TMDB_KEY}&language=${language}&page=${page}`);

        // If there's an issue with the network or the response is not valid, throw an error
        if (!response.ok) {
            throw new Error('Network error or invalid response');
        };

        // Parse the response data into JSON format
        const popularMovies = await response.json();
        const movies = popularMovies.results;

        // Fetch providers for each movie
        const moviesWithProvidersPromises = movies.map(async movie => {
            const providersResponse = await fetch(`${process.env.API_TMDB_BASE_URL}movie/${movie.id}/watch/providers?api_key=${process.env.API_TMDB_KEY}&region=FR`);
            if (providersResponse.ok) {
                const providersData = await providersResponse.json();
                movie.providers = [];
                // Check if information is available for France
                if (providersData.results.FR) {
                    const franceProviders = providersData.results.FR;
                    // Browse the keys of the franceProviders object
                    for (const offerType in franceProviders) {
                        if (Object.hasOwnProperty.call(franceProviders, offerType)) {
                            const offers = franceProviders[offerType];
                            // Check if the offer is an array
                            if (Array.isArray(offers)) {
                                // Add the names of content providers for each offer type
                                offers.forEach(provider => {
                                    if (provider.provider_name) {
                                        movie.providers.push(provider.provider_name);
                                    }
                                });
                            } else {
                                // If it is not an array, add the provider name directly
                                if (offers.provider_name) {
                                    movie.providers.push(offers.provider_name);
                                };
                            };
                        };
                    };
                };
            }
            return movie;
        });

        // Wait for all movies with providers to be fetched
        const moviesWithProviders = await Promise.all(moviesWithProvidersPromises);

        // Cache the popular movies data for future use
        cache.set(cacheKey, {
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });

        // Send the popular movies data in the response along with current page and total pages
        res.json({
            movies: moviesWithProviders,
            currentPage: page,
            totalPages: popularMovies.total_pages
        });
    } catch (error) {
        // If any error occurs during the process, log it and send an error response
        console.error('Error fetching popular movies:', error);
        res.status(500).json({ error: 'Error fetching popular movies.' });
    }
  },

  // Gives movie recommendations based on a movie's ID
  async fetchRecommendation(req, res) {
    const movieId = req.params.id;
    const language = 'fr-FR';
    const page = req.query.page || 1;

    try {
      const recommendation = await getRecommendations(movieId, language, page);
      res.json(recommendation);

    } catch (error) {
      console.error('Error fetching recommendations:', error);
      res.status(500).json({ error: 'Error fetching recommendations.' });
    }
  },

  // Allows you to recommend a movie based on the random id of a movie in the favorites list
  async fetchRecommendationWithRandomMovie(req, res) {
    const userId = req.params.id;

    try {
      const randomFavoriteMovie = await recommendationDataMapper.getRandomFavoriteMovieId(userId);
      const recommendation = await getRecommendations(randomFavoriteMovie, 'fr-FR', req.query.page || 1);
      
      res.json(recommendation);

    } catch (error) {
      debug('Error fetching random favorite movie and calling fetchRecommendation :', error);
      res.status(500).json({ error: 'Error fetching random favorite movie and calling fetchRecommendation.' });
    }
  },
};

module.exports = movieController;