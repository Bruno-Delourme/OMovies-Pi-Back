const debug = require('debug')('app:ToReviewRouter');
const express = require('express');
const { toReviewController } = require('../controllers');
const cw = require('../controllers/controllerWrapper.js');

const router = express.Router();

router.post("/addToToReview/:id", cw(toReviewController.insertIntoToReview));

router.get("/showToReview/:id", cw(toReviewController.showToReview));

router.get("/showNewToReview/:id", cw(toReviewController.showNewToReview));

router.delete("/deleteFromToReview/:id", cw(toReviewController.deleteFromToReview));

debug('API toReview router initialized');

module.exports = router;