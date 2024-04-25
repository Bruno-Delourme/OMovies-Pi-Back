const debug = require('debug')('app:controller');
require('dotenv').config();
const errorHandler = require('../service/error.js');

const groupDataMapper = require('../models/group.js');

const groupController = {

// Function that allows you to create a group
  async create(req, res) {
    debug('group create controller called');

    try {
      const { name } = req.body;
      const id = req.params.id;

      const updated_at = new Date();

      // Attempting to create a new group using the groupDataMapper's create method
      const createdGroup = await groupDataMapper.create({ name }, { id, updated_at });
      res.json({ status: 'success', data: createdGroup });

    } catch (error) {
      debug('Error creating group :', error);
      errorHandler._500('Error creating group', req, res);
    };
  },

// Function which allows you to display a group
  async show(req, res) {
    debug('group show controller called');

    try {
      const id = req.params.id

      // Attempting to find the group associated with the user id using the groupDataMapper's findGroup method
      const group = await groupDataMapper.findGroup(id);
      res.json({ status: 'success', data: group });

    } catch (error) {
      debug('Error displaying group :', error);
      errorHandler._500('Error displaying group', req, res);
    };
  },

  async findGroupUsers(req, res) {
    debug('group findGroupUsers controller called');

    try {
      const id = req.params.id;

      const users = await groupDataMapper.findGroupUsers(id);
      res.json({ status: 'success', data: users });

    } catch (error) {
      debug('Error displaying group members :', error);
      errorHandler._500('Error displaying group members', req, res);
    };
  },

  async addToGroup(req, res) {
    debug('group addToGroup controller called');

    try {
      const { pseudo, groupId } = req.body;

      const updated_at = new Date();

      const result = await groupDataMapper.addToGroup({ id: groupId }, { pseudo, updated_at });

          return res.json({ status: 'success', data: result });

  } catch (error) {
      console.error('Error adding user to group:', error);
      errorHandler._500('Error adding user to group', req, res);
  };
  },

  async removeToGroup(req, res) {
    debug('group removeToGroup controller called');

    try {
      const { pseudo } = req.body;

      const updated_at = new Date();

      const result = await groupDataMapper.removeToGroup({ pseudo, updated_at });

      return res.json({ status: 'success', data: result });

    } catch {
      console.error('Error removing user from group:', error);
      errorHandler._500('Error removing user from group', req, res);
    };
  },

  async delete(req, res) {
    debug('group delete controller called');

    try {
      const id = req.params.id;

      const updated_at = new Date();

      const result = await groupDataMapper.delete({ id, updated_at });

      return res.json({ status: 'success', message: 'Group successfully deleted.' });

    } catch {
        console.error('Error deleting group:', error);
        errorHandler._500('Error deleting group', req, res);
    };
  },
};

module.exports = groupController;