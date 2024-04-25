const debug = require('debug')('app:MailRouter');
const express = require('express');
const cw = require('../controllers/controllerWrapper.js');

const { mailController } = require('../controllers');

const router = express.Router();

router.post('/send-mail', cw(mailController.sendMail));

module.exports = router;