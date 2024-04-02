const debug = require('debug')('app:MovieRouter');
const express = require('express');
const { movieController } = require('../controllers');

const router = express.Router();

router.get("/movies/:keyword", movieController.fetchMoviesByKeyword);

router.get("/moviesByActor/:actor", movieController.fetchActorDetails);

router.get("/movie/:id", movieController.fetchMovieById);

router.get("/movieByTitle/:title", movieController.fetchMovieByTitle);



module.exports = router;