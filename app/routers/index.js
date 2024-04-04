const debug = require('debug')('app:router');
const express = require('express');
const userRouter = require('./user.js');
const movieRouter = require('./movie.js');
const listRouter = require('./list.js');
 
const router = express.Router();

router.use(userRouter);
router.use(movieRouter);
router.use(listRouter);

module.exports = router;
