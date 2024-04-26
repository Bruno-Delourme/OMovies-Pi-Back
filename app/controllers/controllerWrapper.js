const errorHandler = require('../service/error.js');

function controllerWrapper(controller) {
  return async function (req, res, next) {

    try {
      await controller(req, res, next);

    } catch(error) {
      errorHandler._500('An error has occurred in the controller', req, res);
    }
  };
};

module.exports = controllerWrapper;