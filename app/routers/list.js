const debug = require('debug')('app:ListRouter');
const express = require('express');
const { listController } = require('../controllers');

const router = express.Router();

router.post("/addToList", listController.insertIntoList);

router.post("/addToToReview", listController.insertIntoToReview);

router.get("/list", listController.show);

router.delete("/removeFromList/:id", listController.delete);

debug('API list router initialized');

module.exports = router;