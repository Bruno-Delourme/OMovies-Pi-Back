const debug = require('debug')('app:VoteRouter');
const express = require('express');
const cw = require('../controllers/controllerWrapper.js');

const { voteController } = require('../controllers');

const router = express.Router();

// NE PAS OUBLIER D'ENVOYER LE TOKEN

// id du user en paramètre
// Dois recevoir l'id', title, poster_path, overview et le groupId en body 
router.post("/createVote/:id", cw(voteController.create));

// id du groupe dont les membres ont votés
router.get("/showVote/:id", cw(voteController.showVote));

// id du group en paramètre
router.get("/movieSelection/:id", cw(voteController.movieSelection));

// id du user en paramètre
// Dois recevoir l'id, title, poster_path, overview du nouveau film pour lequel le user vote et le groupId
router.patch("/changingVote/:id", cw(voteController.updateVote));

// id du user qui supprime son vote en paramètre
router.delete("/deleteVote/:id", cw(voteController.delete));

debug('API vote router initialized');

module.exports = router;