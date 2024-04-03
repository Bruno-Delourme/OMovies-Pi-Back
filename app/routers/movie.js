const debug = require('debug')('app:MovieRouter');
const express = require('express');
const { movieController } = require('../controllers');

const router = express.Router();

router.get("/movie/:id", movieController.fetchMovieById);

router.get("/movies/:keyword", movieController.fetchMoviesByKeyword);

router.get("/movieByTitle/:title", movieController.fetchMovieByTitle);

router.get("/moviesByActor/:actor", movieController.fetchActorDetails);

router.get("/newMovies", movieController.fetchNewMovies);

router.get("/searchBar/:query", movieController.fetchBySearchBar);

// router.get("/popular", movieController)

module.exports = router;