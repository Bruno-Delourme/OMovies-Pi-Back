const debug = require('debug')('app:controller');
require('dotenv').config();
const toReviewMovieDataMapper = require('../models/to_review_movie.js');
const movieDBDataMapper = require('../models/movieDB.js');

const toReviewMovieController = {

  // Function which inserts a film into the list of films to watch again
  async insertIntoToReview(req, res) {
    debug('list insertIntoToReview controller called');

    const { userId, movieId, title, poster_path, overview, genre } = req.body;

    if (!movieId || !title || !overview || !genre || !actor) {
      return errorHandler._400('Incomplete data', req, res);
    };

    const picture = poster_path || 'No poster';

    try {
        
        // Insert the movie into the database and retrieve the ID of the inserted movie
        const insertIntoMovie = await movieDBDataMapper.insertIntoMovie({ id: movieId, title, poster_path: picture, overview });

        // Insert the movie into the user's list of movies to watch again
        const insertIntoToReview = await toReviewMovieDataMapper.insertIntoToReview({ id: userId }, { id: movieId });
        
        res.json({ status: 'success', data: { insertIntoMovie, insertIntoToReview } });

    } catch (error) {
        debug('Erreur lors de l\'insertion dans la liste à revoir :', error);
        res.status(500).json({ status: 'error', message: 'Erreur lors de l\'insertion dans la liste à revoir.' });
    };
  },

  // Function which allows you to display the list of films to watch again
  async showToReview(req, res) {
    debug('ToReview show controller called');

    try {
      const id = req.user.id

      // Shows the user's list of favorites
      const favorite = await toReviewMovieDataMapper.showToReview(id);

      res.json({ status: 'success', data: favorite });

    } catch (error) {
      debug('Erreur lors de l\'affichage de la liste des films à revoir:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage de la liste des films à revoir.' });
    };
  },

  // Function that allows you to delete a film from the list of films to watch again
  async deleteFromToReview(req, res) {
    debug('toReview delete controller called');

    
  try {
    const userId = req.user.id;
    const { movieId } = req.body;

    // Removes a movie from the user's toReview list
    const deleteFromToReview = await toReviewMovieDataMapper.deleteFromToReview({id: userId}, {id: movieId});

    res.json({ status: 'success' });

    } catch (error) {
      debug('Erreur lors de la suppression du film dans la liste des films à revoir:', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du film dans la liste des films à revoir.' });
    };
},
};

module.exports = toReviewMovieController;