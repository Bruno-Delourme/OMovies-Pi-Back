const debug = require('debug')('app:UserRouter');
const express = require('express');
const { userController } = require('../controllers');
const validation = require('../service/validation/validate.js')

const router = express.Router();

router.post("/user", validation.createUser, userController.create);

router.post("/login", validation.loginUser, userController.login);

router.delete("/user/:id", userController.delete);

debug('API user router initialized');

module.exports = router;