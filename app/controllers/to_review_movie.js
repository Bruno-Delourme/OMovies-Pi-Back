const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const toReviewMovieDataMapper = require('../models/to_review_movie.js');
const genreDataMapper = require('../models/genre.js');
const actorDataMapper = require('../models/actor.js');
const movieGenreDataMapper = require('../models/movie_genre.js');
const movieActorDataMapper = require('../models/movie_actor.js');
const movieDBDataMapper = require('../models/movieDB.js');

const toReviewMovieController = {

  // Function which inserts a film into the list of films to watch again
  async insertIntoToReview(req, res) {
    debug('list insertIntoToReview controller called');

    const { movieId, title, poster_path, overview, genreName, genreId, actorName, actorId } = req.body;
    const userId = req.parmas.id;

    if (!movieId || !title || !overview || !genreName || !genreId || !actorName || !actorId) {
      return errorHandler._400('Incomplete data', req, res);
    };

    const picture = poster_path || 'No poster';

    try {
        
        // Insert the movie into the database
        const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

        // Insert the movie into the user's list of movies to watch again
        const insertIntoToReview = await toReviewMovieDataMapper.insertIntoToReview({ id: userId }, { id: movieId });

        // Insert the genre of the movie into the database table
        const insertIntoGenre = await genreDataMapper.insertIntoGenre({ id: genreId, name: genreName });

        // Insert the genre/movie binary
        const insertIntoMovieGenre = await movieGenreDataMapper.insertIntoMovieGenre({ id: movieId }, { id: genreId });

        // Insert the actor of the film into the database table
        const insertIntoActor = await actorDataMapper.insertIntoActor({ id: actorId, name: actorName });

        // Insert the actor/movie binary
        const insertIntoMovieActor = await movieActorDataMapper.insertIntoMovieActor({ id: movieId }, { id: actorId });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoToReview, insertIntoGenre, insertIntoMovieGenre, insertIntoActor, insertIntoMovieActor } });

    } catch (error) {
        debug('Error when inserting into the list to review :', error);
        errorHandler._500(error, req, res);
    };
  },

  // Function which allows you to display the list of films to watch again
  async showToReview(req, res) {
    debug('ToReview show controller called');

    try {
      const id = req.params.id

      // Shows the user's list of favorites
      const toReview = await toReviewMovieDataMapper.showToReview(id);

      res.json({ status: 'success', data: toReview });

    } catch (error) {
      debug('Error displaying the list of movies to watch again:', error);
      errorHandler._500(error, req, res);
    };
  },

  // Feature that displays movies to review by genre
  async showToReviewByGenre(req, res) {
    debug('toReview showByGenre controller called');

    try {
      const id = req.params.id;
      const { genre } = req.body;

      const toReview = await movieGenreDataMapper.showToReviewByGenre({ id }, { genre });

      res.json({ status: 'success', data: toReview });

    } catch {
      debug('Error displaying the list of movies to watch again:', error);
      errorHandler._500(error, req, res);
    };
  },

  // Function that allows you to delete a film from the list of films to watch again
  async deleteFromToReview(req, res) {
    debug('toReview delete controller called');

    
  try {
    const userId = req.params.id;
    const { movieId } = req.body;

    // Removes a movie from the user's toReview list
    const deleteFromToReview = await toReviewMovieDataMapper.deleteFromToReview({id: userId}, {id: movieId});

    res.json({ status: 'success' });

    } catch (error) {
      debug('Error removing movie from list of movies to watch again:', error);
      errorHandler._500(error, req, res);
    };
  },
};

module.exports = toReviewMovieController;