const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const toReviewMovieDataMapper = require('../models/to_review_movie.js');
const movieDBDataMapper = require('../models/movieDB.js');

const toReviewMovieController = {

  // Allows you to insert a film into the list of films to watch again
  async insertIntoToReview(req, res) {
    debug('list insertIntoToReview controller called');

    const movieId = req.body.id;
    const title = req.body.title;
    const poster_path = req.body.poster_path;
    const overview = req.body.overview;
    
    const userId = req.params.id;

    if (!movieId || !title || !overview) {
      return errorHandler._400('Incomplete data', req, res);
    };

    const picture = poster_path || 'No poster';

    // Insert the movie into the database
    const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

    // Insert the movie into the user's list of movies to watch again
    const insertIntoToReview = await toReviewMovieDataMapper.insertIntoToReview({ id: userId }, { id: movieId });
        
    res.json({ status: 'success', data: { insertIntoMovie, insertIntoToReview } });
  },

  // Allows you to display the list of films to watch again
  async showToReview(req, res) {
    debug('ToReview show controller called');

    const id = req.params.id

    // Shows the user's list of favorites
    const toReview = await toReviewMovieDataMapper.showToReview(id);

    res.json({ status: 'success', data: toReview });
  },

  // Allows you to display the list of latest movies to watch again
  async showNewToReview(req, res) {
    debug('NewToReview show controller called');

    const id = req.params.id;

    // Shows the user's list of to review
    const toReview = await toReviewMovieDataMapper.showNewToReview(id);

    res.json({ status: 'success', data: toReview });
  },

  // Allows you to delete a film from the list of films to watch again
  async deleteFromToReview(req, res) {
    debug('toReview delete controller called');

  
    const userId = req.params.id;
    const movieId = req.body.id;

    // Removes a movie from the user's toReview list
    const deleteFromToReview = await toReviewMovieDataMapper.deleteFromToReview({id: userId}, {id: movieId});

    res.json({ status: 'success' });
  },
};

module.exports = toReviewMovieController;