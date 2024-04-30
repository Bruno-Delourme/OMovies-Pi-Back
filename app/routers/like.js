const debug = require('debug')('app:UserRouter');
const express = require('express');
const cw = require('../controllers/controllerWrapper.js');

const { likeController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.post("/like/:id",authMiddleware.authMiddleware, cw(likeController.create));

router.get("/showTotalLikes", cw(likeController.showTotalLikes));

router.delete("/dislike/:id", authMiddleware.authMiddleware, cw(likeController.delete));

debug('API like router initialized');

module.exports = router;