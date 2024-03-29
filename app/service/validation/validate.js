const { schemaCreateUser, schemaLoginUser } = require("./schema.js");

module.exports = {

  createUser(req, res, next) {
    const { error } = schemaCreateUser.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);

    } else {
      next();
    }
  },

  loginUser(req, res, next) {
    const { error } = schemaLoginUser.validate(req.body);

    if (error) {
      throw new Error(error.details[0].message);

    } else {
      next();
    }
  },
}