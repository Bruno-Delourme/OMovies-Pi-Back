const calculateAge = require('../service/calculateAge');
const userDataMapper = require('../models/user.js');
const errorHandler = require('../service/error.js');

const ageMiddleware = {

  async movieFilterMiddleware(req, res, next) {
    try {
        const userId = req.user ? req.user.id : null;
        const isUserUnderage = userId ? await isUserUnderage(userId) : false;

        if (isUserUnderage || !userId) {
            req.filterAdult = true;

        } else {
            req.filterAdult = false;
        };

        next();

    } catch (error) {
        errorHandler._500(error, req, res);
    }
  },

  async isUserUnderage(pseudo) {
    try {
      const user = await userDataMapper.findUser(pseudo);

      if (!user) {
        errorHandler._404('User not found', null, null);
      };
    
    const age = calculateAge(user.birthday);

    return age < 18;

    } catch (error) {
        errorHandler._500(error, null, null); 
    };
  },

};

module.exports = ageMiddleware;
