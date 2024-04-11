const debug = require('debug')('app:ListRouter');
const express = require('express');
const { listController } = require('../controllers');

const router = express.Router();

router.post("/addToList", listController.insertIntoList);

router.post("/addToToReview", listController.insertIntoToReview);

router.get("/list/:id", listController.showList);

router.get("/toReview/:id", listController.showToReview)

router.delete("/deleteFromList", listController.deleteFromList);

router.delete("/deleteFromToReview", listController.deleteFromToReview);

debug('API list router initialized');

module.exports = router;