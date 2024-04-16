const debug = require('debug')('app:FavoriteRouter');
const express = require('express');
const { favoriteMovieController } = require('../controllers');
const cw = require('../controllers/controllerWrapper')

const router = express.Router();

router.post("/addToFavorite", cw(favoriteMovieController.insertIntoFavorite));

router.get("/showFavorite/:id", cw(favoriteMovieController.showFavorite));

router.delete("/deleteFromFavorite", cw(favoriteMovieController.deleteFromFavorite));

debug('API list router initialized');

module.exports = router;