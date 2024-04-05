const debug = require('debug')('app:ListRouter');
const express = require('express');
const { listController } = require('../controllers');

const router = express.Router();

router.post("/addToList", listController.insert);

router.get("/list", listController.show);

router.delete("/removeFromList/:id", listController.delete);

module.exports = router;