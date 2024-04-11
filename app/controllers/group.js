const debug = require('debug')('app:controller');
require('dotenv').config();
const groupDataMapper = require('../models/group.js');
const userDataMapper = require('../models/user.js');

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

  async findGroupUsers(req, res) {
    debug('group findGroupUsers controller called');

    try {
      const { id } = req.params

      const users = await groupDataMapper.findGroupUsers(id);
      res.json({ status: 'success', data: users });

    } catch (error) {
      debug('Erreur lors de l\'affichage des membres du groupe :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de l\'affichage des membres du groupe' });
    };
  },

  async addToGroup(req, res) {
    debug('group addToGroup controller called');

    try {
      const { pseudo, groupId } = req.body;

      const result = await groupDataMapper.addToGroup({ id: groupId }, { pseudo });

      if (result.status === 'success') {
          return res.json({ status: 'success', message: 'Utilisateur ajouté au groupe avec succès.' });

      } else {
          return res.status(500).json({ status: 'error', message: 'Erreur lors de l\'ajout de l\'utilisateur au groupe.' });
      };

  } catch (error) {
      console.error('Erreur lors de l\'ajout de l\'utilisateur au groupe:', error);
      return res.status(500).json({ status: 'error', message: 'Erreur lors de l\'ajout de l\'utilisateur au groupe.' });
  };
  },

  async removeToGroup(req, res) {
    debug('group removeToGroup controller called');

    try {
      const { pseudo } = req.body;

      const result = await groupDataMapper.removeToGroup({ pseudo });

      if (result.status === 'success') {
        return res.json({ status: 'success', message: 'Utilisateur retiré du groupe avec succès.' });

    } else {
        return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression de l\'utilisateur du groupe.' });
    };
    } catch {
      console.error('Erreur lors de la suppression de l\'utilisateur du groupe:', error);
      return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression de l\'utilisateur du groupe.' });
    };
  },

  async delete(req, res) {
    debug('group delete controller called');

    try {
      const { id } = req.params;

      const result = await groupDataMapper.delete({ id });

      if (result.status === 'success') {
        return res.json({ status: 'success', message: 'Groupe supprimé avec succès.' });

      } else {
        return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du groupe.' });
      };

    } catch {
      console.error('Erreur lors de la suppression du groupe:', error);
      return res.status(500).json({ status: 'error', message: 'Erreur lors de la suppression du groupe.' });
    };
  },
};

module.exports = groupController;