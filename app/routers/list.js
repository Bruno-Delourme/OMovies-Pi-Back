const debug = require('debug')('app:ListRouter');
const express = require('express');
const { listController } = require('../controllers');

const router = express.Router();

router.post("/addList", listController.insert);

module.exports = router;