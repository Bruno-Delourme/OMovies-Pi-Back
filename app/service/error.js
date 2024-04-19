const debug = require('debug')('service:errorHandler');

const errorHandler = {

  _400: (errors, _, res)  => {
    res.status(400).json({
      type: 'Bad request',
      errors,
    });
  },

  _401: (errors, _, res)  => {
    res.status(401).json({
      type: 'Unauthorized',
      errors,
    });
  },

  _404: (error, _, res) => {
    res.status(404).json({
      type: 'Not found',
      error: 'Ressource not found. Please verify the provided ID.',
    });
  },

  _500: (error, _,res) => {
    console.trace(error);
    res.status(500).json({
      type: 'Internal Server Error',
      error: error.toString(),
    });
  },
};

module.exports = errorHandler;