const debug = require('debug')('app:FavoriteRouter');
const express = require('express');
const { favoriteMovieController } = require('../controllers');
const cw = require('../controllers/controllerWrapper.js')

const router = express.Router();

router.post("/addToFavorite/:id", cw(favoriteMovieController.insertIntoFavorite));

router.post("/showFavorite/:id", cw(favoriteMovieController.showFavorite));

router.post("/showFavoriteByGenre/:id", cw(favoriteMovieController.showFavoriteByGenre));

router.delete("/deleteFromFavorite/:id", cw(favoriteMovieController.deleteFromFavorite));

debug('API list router initialized');

module.exports = router;