const debug = require("debug")("app:UserRouter");
const express = require("express");
const { userController: controller, userController } = require("../../controllers/api");
const validation = require("../../service/validation/validate.js")

const router = express.Router();

router.post('/user', validation.createUser, userController.create);

module.exports = router;