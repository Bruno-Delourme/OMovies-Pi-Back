const debug = require('debug')('app:MovieRouter');
const express = require('express');
const { movieAPIController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.get("/movie/:id", movieAPIController.fetchMovieById);

router.get("/movies/:genre", movieAPIController.fetchMoviesByGenre);

router.get("/moviesRating/:genre", movieAPIController.fetchMoviesByGenreRating);

router.get("/movieByTitle/:title", movieAPIController.fetchMovieByTitle);

router.get("/moviesByActor/:actor", movieAPIController.fetchMoviesByActor);

router.get("/newMovies", movieAPIController.fetchNewMovies);

router.get("/searchBar", movieAPIController.fetchBySearchBar);

router.get("/popularMovies", movieAPIController.fetchPopularMovie);

router.get("/recommendationByFavoris/:id",authMiddleware.authMiddleware, movieAPIController.fetchRecommendationWithRandomMovie);

router.get("/recommendation/:id", movieAPIController.fetchRecommendation);

debug('API movie router initialized');

module.exports = router;