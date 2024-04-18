const debug = require('debug')('app:router');
const express = require('express');
const authMiddleware = require('../middlewares/authentication.js');

const userRouter = require('./user.js');
const movieAPIRouter = require('./movieAPI.js');
const favoriteMovieRouter = require('./favorite_movie.js');
const toReviewMovieRouter = require('./to_review_movie.js');
const likeRouter = require('./like.js');
const commentRouter = require('./comment.js');
 
const router = express.Router();

router.use(movieAPIRouter);
router.use(userRouter);
router.use(likeRouter);
router.use(commentRouter);
router.use(authMiddleware.authMiddleware, favoriteMovieRouter);
router.use(authMiddleware.authMiddleware, toReviewMovieRouter);


module.exports = router;
