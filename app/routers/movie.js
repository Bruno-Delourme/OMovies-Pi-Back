const debug = require('debug')('app:MovieRouter');
const express = require('express');
const { movieController } = require('../controllers');

const router = express.Router();

router.get("/movie/:id", movieController.fetchMovieById);

router.get("/movies/:genre", movieController.fetchMoviesByGenre);

router.get("/movieByTitle/:title", movieController.fetchMovieByTitle);

router.get("/moviesByActor/:actor", movieController.fetchActorDetails);

router.get("/newMovies", movieController.fetchNewMovies);

router.get("/searchBar", movieController.fetchBySearchBar);

router.get("/popularMovies", movieController.fetchPopularMovie);

router.get("/recommendation/:id", movieController.fetchRecommendation);

debug('API movie router initialized');

module.exports = router;