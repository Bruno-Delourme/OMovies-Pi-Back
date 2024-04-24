const debug = require('debug')('app:router');
const express = require('express');
const authMiddleware = require('../middlewares/authentication.js');
const filterByAge = require('../middlewares/filterByAge.js');

const userRouter = require('./user.js');
const movieAPIRouter = require('./movieAPI.js');
const favoriteMovieRouter = require('./favorite_movie.js');
const toReviewMovieRouter = require('./to_review_movie.js');
const likeRouter = require('./like.js');
const commentRouter = require('./comment.js');
const mailRouter = require('./mail.js');
 
const router = express.Router();

router.use(filterByAge.movieFilterMiddleware, movieAPIRouter);
router.use(userRouter);
router.use(likeRouter);
router.use(commentRouter);
router.use(authMiddleware.authMiddleware, favoriteMovieRouter);
router.use(authMiddleware.authMiddleware, toReviewMovieRouter);
router.use(authMiddleware.authMiddleware, mailRouter);


module.exports = router;
