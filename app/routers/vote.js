const debug = require('debug')('app:VoteRouter');
const express = require('express');
const { voteController } = require('../controllers');

const router = express.Router();



debug('API vote router initialized');

module.exports = router;