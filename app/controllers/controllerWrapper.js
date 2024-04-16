const debug = require('debug')('app:controllerWrapper');
const errorHandler = require('../service/error.js');

function controllerWrapper(controller) {
  return async function (req, res, next) {

    try {
      await controller(req, res, next);

    } catch(error) {
      debug('An error has occurred in the controller:', error);
      errorHandler._500(error, req, res);
    }
  };
};

module.exports = controllerWrapper;