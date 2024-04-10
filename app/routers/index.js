const debug = require('debug')('app:router');
const express = require('express');
const authMiddleware = require('../middlewares/authentication.js');
const userRouter = require('./user.js');
const movieRouter = require('./movie.js');
const listRouter = require('./list.js');
// const groupRouter = require('./group.js');
 
const router = express.Router();

router.use(movieRouter);
router.use(userRouter);
router.use(authMiddleware.authMiddleware, listRouter);
// router.use(authMiddleware.authMiddleware, groupRouter);

module.exports = router;
