const debug = require('debug')('app:UserRouter');
const express = require('express');

const cw = require('../controllers/controllerWrapper.js');
const validation = require('../service/validation/validate.js');
const authMiddleware = require('../middlewares/authentication.js');

const { userController } = require('../controllers');

const router = express.Router();

router.post("/createUser", validation.createUser, cw(userController.create));

router.post("/login", validation.loginUser, cw(userController.login));

router.post("/findUser", authMiddleware.authMiddleware, validation.findUser, cw(userController.show));

router.patch("/updateUser/:id", authMiddleware.authMiddleware, validation.updateUser, cw(userController.update));

router.delete("/deleteUser/:id", authMiddleware.authMiddleware,  cw(userController.delete));

debug('API user router initialized');

module.exports = router;