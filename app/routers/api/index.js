const debug = require("debug")("app:router");
const express = require("express");
const userRouter = require('./user.js');
 
const router = express.Router();

router.use(userRouter);

module.exports = router;
