const debug = require('debug')('app:UserRouter');
const express = require('express');
const cw = require('../controllers/controllerWrapper.js');

const { commentController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.post("/createComment/:id", authMiddleware.authMiddleware, cw(commentController.create));

router.get("/showComment", cw(commentController.show));

// :id => Comment 's id
router.patch("/updateComment/:id", authMiddleware.authMiddleware, cw(commentController.update));

// :id => Comment 's id
router.delete("/deleteComment/:id", authMiddleware.authMiddleware, cw(commentController.delete));

debug('API comment router initialized');

module.exports = router;