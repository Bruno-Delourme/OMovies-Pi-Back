const debug = require('debug')('app:MailRouter');
const express = require('express');

const { mailController } = require('../controllers');

const router = express.Router();

router.post('/send-mail', mailController.sendMail);

module.exports = router;