const debug = require('debug')('app:GroupRouter');
const express = require('express');
const cw = require('../controllers/controllerWrapper.js');

const { groupController } = require('../controllers');

const router = express.Router();

// NE PAS OUBLIER D'ENVOYER LE TOKEN

// id du user qui crée le groupe en paramètre
// Dois recevoir aussi le name du groupe
router.post("/createGroup/:id", cw(groupController.create));

// Affiche le groupe name d'un user. id du user
router.get("/showGroup/:id", cw(groupController.show));

// Dois recevoir le pseudo du user à ajouter au groupe et le groupId
router.patch("/addToGroup", cw(groupController.addToGroup));

// Dois recevoir le pseudo du user à enlever du groupe
router.patch("/removeToGroup", cw(groupController.removeToGroup));

// id du groupe à supprimer
router.delete("/deleteGroup/:id", cw(groupController.delete));

// id du groupe dont tu veux voir les membres
router.get("/groupUsers/:id", cw(groupController.findGroupUsers));

module.exports = router;