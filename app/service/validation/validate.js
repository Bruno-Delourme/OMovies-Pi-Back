const { schemaCreateUser, schemaLoginUser, schemaUpdateUser } = require('./schema.js');

module.exports = {

  createUser(req,_, next) {
    const { error } = schemaCreateUser.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);

    } else {
      next();
    };
  },

  loginUser(req,_, next) {
    const { error } = schemaLoginUser.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);

    } else {
      next();
    };
  },

    updateUser(req,_, next) {
      const { error } = schemaUpdateUser.validate(req.body);

      if (error) {
        throw new Error(error.details[0].message);

      } else {
        next();
      };
    },
};