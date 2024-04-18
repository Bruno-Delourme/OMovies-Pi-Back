const debug = require('debug')('app:UserRouter');
const express = require('express');

const { likeController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.get("/like/:id",authMiddleware.authMiddleware, likeController.create);

router.get("/showTotalLikes", likeController.showTotalLikes);

router.get("/dislike/:id", authMiddleware.authMiddleware, likeController.delete);

module.exports = router;