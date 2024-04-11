const debug = require('debug')('app:controller');
require('dotenv').config();
const groupDataMapper = require('../models/group.js');

const groupController = {

// Function that allows you to create a group
  async create(req, res) {
    debug('group create controller called');

    try {
      const { name } = req.body;
      const id = req.user.id

      // Attempting to create a new group using the groupDataMapper's create method
      const createdGroup = await groupDataMapper.create({ name }, { id });
      res.json({ status: 'success', data: createdGroup });

    } catch (error) {
      debug('Erreur lors de la création du groupe :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création du groupe.' });
    };
  },

// Function which allows you to display a group
  async show(req, res) {
    debug('group show controller called');

    try {
      const id = req.user.id

      // Attempting to find the group associated with the user id using the groupDataMapper's findGroup method
      const group = await groupDataMapper.findGroup(id);
      res.json({ status: 'success', data: group });

    } catch (error) {
      debug('Erreur lors de l\'affichage du groupe :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage du groupe' });
    };
  },
};

module.exports = groupController;