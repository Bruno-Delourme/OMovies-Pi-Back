const debug = require('debug')('app:UserRouter');
const express = require('express');
const { userController } = require('../controllers');
const validation = require('../service/validation/validate.js');
const authMiddleware = require('../middlewares/authentication.js');

const router = express.Router();

router.post("/user", validation.createUser, userController.create);

router.post("/login", validation.loginUser, userController.login);

router.post("/findUser", authMiddleware.authMiddleware, validation.findUser, userController.show);

router.patch("/user", authMiddleware.authMiddleware, validation.updateUser, userController.update);

router.delete("/user/:id", authMiddleware.authMiddleware,  userController.delete);

debug('API user router initialized');

module.exports = router;