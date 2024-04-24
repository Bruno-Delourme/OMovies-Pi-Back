const calculateAge = require('../service/calculateAge');
const userDataMapper = require('../models/user.js');

const debug = require('debug')('app:middleware');

const ageMiddleware = {

  async movieFilterMiddleware(req, res, next) {
    try {
        const userId = req.user ? req.user.id : null;
        const isUserUnderage = userId ? await isUserUnderage(userId) : false;

        if (isUserUnderage || !userId) {
            req.filterAdult = true;
        } else {
            req.filterAdult = false;
        }

        next();
    } catch (error) {
        next(error);
    }
  },

  async isUserUnderage(pseudo) {
    const user = await userDataMapper.findUser(pseudo);
    if (!user) {
        throw new Error('User not found');
    }
    
    const age = calculateAge(user.birthday);

    return age < 18;
  },

};

module.exports = ageMiddleware;
