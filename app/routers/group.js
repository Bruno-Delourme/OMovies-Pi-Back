const debug = require('debug')('app:GroupRouter');
const express = require('express');
const { groupController } = require('../controllers');

const router = express.Router();

router.post("/addGroup", groupController.create);

router.patch("/addToGroup", groupController.addToGroup);

router.patch("/removeToGroup", groupController.removeToGroup);

router.get("/group", groupController.show);

router.get("/groupUsers/:id", groupController.findGroupUsers);

module.exports = router;