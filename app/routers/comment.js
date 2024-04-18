const debug = require('debug')('app:UserRouter');
const express = require('express');

const { commentController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.post("/createComment/:id",authMiddleware.authMiddleware, commentController.create);

router.get("/showComment", commentController.show);

module.exports = router;