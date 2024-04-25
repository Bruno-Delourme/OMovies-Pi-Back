const debug = require('debug')('app:MovieRouter');
const express = require('express');

const cw = require('../controllers/controllerWrapper.js');
const authMiddleware = require('../middlewares/authentication.js');

const { movieAPIController } = require('../controllers');


const router = express.Router();

router.get("/movie/:id", cw(movieAPIController.fetchMovieById));

router.get("/movies/:genre", cw(movieAPIController.fetchMoviesByGenre));

router.get("/moviesRating/:genre", cw(movieAPIController.fetchMoviesByGenreRating));

router.get("/movieByTitle/:title", cw(movieAPIController.fetchMovieByTitle));

router.get("/moviesByActor/:actor", cw(movieAPIController.fetchMoviesByActor));

router.get("/newMovies", cw(movieAPIController.fetchNewMovies));

router.get("/searchBar", cw(movieAPIController.fetchBySearchBar));

router.get("/popularMovies", cw(movieAPIController.fetchPopularMovie));

router.get("/recommendationByFavoris/:id",authMiddleware.authMiddleware, cw(movieAPIController.fetchRecommendationWithRandomMovie));

router.get("/recommendation/:id", cw(movieAPIController.fetchRecommendation));

debug('API movie router initialized');

module.exports = router;