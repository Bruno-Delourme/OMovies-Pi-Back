const debug = require('debug')('app:GroupRouter');
const express = require('express');
const { groupController } = require('../controllers');

const router = express.Router();

router.post("/addGroup", groupController.create);

router.post("/addToGroup", groupController.addToGroup);

router.get("/group", groupController.show);

router.post("/groupUsers", groupController.findGroupUsers);

module.exports = router;