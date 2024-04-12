const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieController = require('./movie.js');
const listController = require('./list.js');
const groupController = require('./group.js');
const voteController = require('./vote.js');

module.exports = { 
  userController,
  movieController,
  listController,
  groupController,
  voteController
};