const debug = require('debug')('app:controller');
require('dotenv').config();

const groupDataMapper = require('../models/group.js');

const groupController = {

// Function that allows you to create a group
  async create(req, res) {
    debug('group create controller called');

    const { name } = req.body;
    const id = req.params.id;

    const updated_at = new Date();

    // Attempting to create a new group using the groupDataMapper's create method
    const createdGroup = await groupDataMapper.create({ name }, { id, updated_at });

    res.json({ status: 'success', data: createdGroup });
  },

// Function which allows you to display a group
  async show(req, res) {
    debug('group show controller called');

    const id = req.params.id

    // Attempting to find the group associated with the user id using the groupDataMapper's findGroup method
    const group = await groupDataMapper.findGroup(id);

    res.json({ status: 'success', data: group });
  },

  async findGroupUsers(req, res) {
    debug('group findGroupUsers controller called');

    const id = req.params.id;

    const users = await groupDataMapper.findGroupUsers(id);
    res.json({ status: 'success', data: users });
  },

  async addToGroup(req, res) {
    debug('group addToGroup controller called');

    const { pseudo, groupId } = req.body;

    const updated_at = new Date();

    const result = await groupDataMapper.addToGroup({ id: groupId }, { pseudo, updated_at });

    res.json({ status: 'success', data: result });
  },

  async removeToGroup(req, res) {
    debug('group removeToGroup controller called');

    const { pseudo } = req.body;

    const updated_at = new Date();

    const result = await groupDataMapper.removeToGroup({ pseudo, updated_at });

    res.json({ status: 'success', data: result });
  },

  async delete(req, res) {
    debug('group delete controller called');

    const id = req.params.id;

    const updated_at = new Date();

    const result = await groupDataMapper.delete({ id, updated_at });

    res.json({ status: 'success', message: 'Group successfully deleted.' });
  },
};

module.exports = groupController;