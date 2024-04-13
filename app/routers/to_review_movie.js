const debug = require('debug')('app:ToReviewRouter');
const express = require('express');
const { toReviewController } = require('../controllers');

const router = express.Router();

router.post("/addToToReview", toReviewController.insertIntoToReview);

router.get("/showToReview/:id", toReviewController.showToReview);

router.delete("/deleteFromToReview", toReviewController.deleteFromToReview);

module.exports = router;