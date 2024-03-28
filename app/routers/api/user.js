const debug = require("debug")("app:UserRouter");
const express = require("express");
const { userController: controller, userController } = require("../../controllers/api");

const router = express.Router();

router.post('/user', userController.create);

module.exports = router;