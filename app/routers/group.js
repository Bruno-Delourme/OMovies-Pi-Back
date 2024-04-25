const debug = require('debug')('app:GroupRouter');
const express = require('express');
const { groupController } = require('../controllers');

const router = express.Router();

// id du user qui crée le groupe
// Dois recevoir aussi le nom du groupe
router.post("/createGroup/:id", groupController.create);

// Affiche le groupe d'une personne. id du user
router.get("/showGroup/:id", groupController.show);

// Dois recevoir le pseudo du user à ajouter au groupe et l'id du groupe
router.patch("/addToGroup", groupController.addToGroup);

// Dois recevoir le pseudo du user à enlever du groupe
router.patch("/removeToGroup", groupController.removeToGroup);

// id du groupe à supprimer
router.delete("/deleteGroup/:id", groupController.delete);

// id du groupe dont tu veux voir les membres
router.get("/groupUsers/:id", groupController.findGroupUsers);

module.exports = router;