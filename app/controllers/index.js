const debug = require('debug')('app:controller');
const userController = require('./user.js');
const movieController = require('./movie.js');

module.exports = { 
  userController,
  movieController
};