const debug = require('debug')('app:GroupRouter');
const express = require('express');
const { groupController } = require('../controllers');

const router = express.Router();

router.post("/addGroup", groupController.create);

router.get("/group", groupController.show);

module.exports = router;