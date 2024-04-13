const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieController = require('./movie.js');
const listController = require('./list.js');

module.exports = { 
  userController,
  movieController,
  listController,
};