const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieController = require('./movie.js');
const listController = require('./list.js');
const groupController = require('./group.js');

module.exports = { 
  userController,
  movieController,
  listController,
  groupController
};