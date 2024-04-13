const debug = require('debug')('app:FavoriteRouter');
const express = require('express');
const { favoriteMovieController } = require('../controllers');

const router = express.Router();

router.post("/addToFavorite", favoriteMovieController.insertIntoFavorite);

router.get("/showFavorite/:id", favoriteMovieController.showFavorite);

router.delete("/deleteFromFavorite", favoriteMovieController.deleteFromFavorite);

debug('API list router initialized');

module.exports = router;