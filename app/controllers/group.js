const debug = require('debug')('app:controller');
require('dotenv').config();
const groupDataMapper = require('../models/group.js');

const groupController = {

  async create(req, res) {
    debug('group create controller called');

    const { name } = req.body;
    const id = req.user.id

    try {
      const createdGroup = await groupDataMapper.create({ name }, { id });
      res.json({ status: 'success', data: createdGroup });

    } catch (error) {
      debug('Erreur lors de la création du groupe :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création du groupe.' });
    };
  },

  async show(req, res) {
    debug('group show controller called');

    try {
      const id = req.user.id
      const group = await groupDataMapper.show(id);
      res.json({ status: 'success', data: group });

    } catch (error) {
      debug('Erreur lors de l\'affichage du groupe :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage du groupe' });
    };
  },
};

module.exports = groupController;