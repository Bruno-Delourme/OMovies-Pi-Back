const debug = require('debug')('app:FavoriteRouter');
const express = require('express');
const { favoriteMovieController } = require('../controllers');
const cw = require('../controllers/controllerWrapper.js')

const router = express.Router();

router.post("/addToFavorite/:id", cw(favoriteMovieController.insertIntoFavorite));

router.get("/showFavorite/:id", cw(favoriteMovieController.showFavorite));

router.get("/showNewFavorite/:id", cw(favoriteMovieController.showNewFavorite));

router.delete("/deleteFromFavorite/:id", cw(favoriteMovieController.deleteFromFavorite));

debug('API favorite router initialized');

module.exports = router;