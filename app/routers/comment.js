const debug = require('debug')('app:UserRouter');
const express = require('express');

const { commentController } = require('../controllers');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.post("/createComment/:id",authMiddleware.authMiddleware, commentController.create);

router.get("/showComment", commentController.show);

// :id => Comment 's id
router.patch("/updateComment/:id", authMiddleware.authMiddleware, commentController.update);

// :id => Comment 's id
router.delete("/deleteComment/:id", authMiddleware.authMiddleware, commentController.delete);

debug('API comment router initialized');

module.exports = router;