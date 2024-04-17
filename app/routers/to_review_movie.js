const debug = require('debug')('app:ToReviewRouter');
const express = require('express');
const { toReviewController } = require('../controllers');
const cw = require('../controllers/controllerWrapper.js');

const router = express.Router();

router.post("/addToToReview/:id", cw(toReviewController.insertIntoToReview));

router.post("/showToReview/:id", cw(toReviewController.showToReview));

router.post("/showToReviewByGenre/:genre", cw(toReviewController.showToReviewByGenre));

router.delete("/deleteFromToReview/:id", cw(toReviewController.deleteFromToReview));

module.exports = router;