const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const favoriteMovieDataMapper = require('../models/favorite_movie.js');
const genreDataMapper = require('../models/genre.js');
const actorDataMapper = require('../models/actor.js');
const movieGenreDataMapper = require('../models/movie_genre.js');
const movieActorDataMapper = require('../models/movie_actor.js');
const movieDBDataMapper = require('../models/movieDB.js');

const favoriteMovieController = {

// Allows you to insert a movie into the favorites list
  async insertIntoFavorite(req, res) {
    debug('list insertIntoFavorite controller called');

    const { movieId, title, poster_path, overview, genreName, genreId, actorName, actorId } = req.body;
    const userId = req.params.id;

    if (!movieId || !title || !overview || !genreName || !genreId || !actorName || !actorId) {
      return errorHandler._400('Incomplete data', req, res);
    };

    const picture = poster_path || 'No poster';

    try {

        // Insert the movie into the database
        const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

        // Insert the movie into the user's favorites list
        const insertIntoFavorite = await favoriteMovieDataMapper.insertIntoFavorite({ id: userId }, { id: movieId });

        // Insert the genre of the movie into the database table
        const insertIntoGenre = await genreDataMapper.insertIntoGenre({ id: genreId, name: genreName });

        // Insert the genre/movie binary
        const insertIntoMovieGenre = await movieGenreDataMapper.insertIntoMovieGenre({ id: movieId }, { id: genreId });

        // Insert the actor of the film into the database table
        const insertIntoActor = await actorDataMapper.insertIntoActor({ id: actorId, name: actorName });

        // Insert the actor/movie binary
        const insertIntoMovieActor = await movieActorDataMapper.insertIntoMovieActor({ id: movieId }, { id: actorId });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoFavorite, insertIntoGenre, insertIntoMovieGenre, insertIntoActor, insertIntoMovieActor } });

    } catch (error) {
        debug('Error while inserting into favorites list:', error);
        errorHandler._500(error, req, res);
    };
  },

// Allows you to view movies from the favorites list
  async showFavorite(req, res) {
    debug('favorite show controller called');

    try {
      const id = req.params.id;

      // Shows the user's list of favorites
      const favorite = await favoriteMovieDataMapper.showFavorite(id);

      res.json({ status: 'success', data: favorite });

    } catch (error) {
      debug('Error displaying list of favorite movies:', error);
      errorHandler._500(error, req, res);
    };
  },

  // Feature that displays favorite movies by genre
  async showFavoriteByGenre(req, res) {
    debug('favorite showByGenre controller called');

    try {
      const id = req.user.id;
      const genre = req.params.genre;

      const favorite = await movieGenreDataMapper.showFavoriteByGenre({ id }, { genre });

      res.json({ status: 'success', data: favorite });

    } catch {
      debug('Error displaying list of favorite movies:', error);
      errorHandler._500(error, req, res);
    };
  },

  // Feature that displays favorite movies by actor
  async showFavoriteByActor(req, res) {
    debug('favorite showByActor controller called');

    try {
      const id = req.user.id;
      const actor = req.params.actor;

      const favorite = await movieActorDataMapper.showFavoriteByActor({ id }, { genre });
      res.json({ status: 'success', date: favorite });
    } catch {
      debug('Error displaying list of favorite movies:', error);
      errorHandler._500(error, req, res);
    };
  },

  // Allows you to delete a film from the list of favorite films
  async deleteFromFavorite(req, res) {
    debug('list delete controller called');

    
  try {
    const userId = req.params.id;
    const { movieId } = req.body;

    // Removes a movie from the user's favorites list
    const deleteFromFavorite = await favoriteMovieDataMapper.deleteFromFavorite({id: userId}, {id: movieId});

    res.json({ status: 'success' });

    } catch (error) {
      debug('Erreur lors de la suppression du film dans la liste des favoris:', error);
      errorHandler._500(error, req, res);
    };
  },
};

module.exports = favoriteMovieController;