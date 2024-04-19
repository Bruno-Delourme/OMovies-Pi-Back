const debug = require('debug')('app:middleware');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = {

  authMiddleware(req, res, next) {
    debug('authentication middleware controller called');
    
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return errorHandler._401(error, req, res);
    };

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken.user;
        next(); 
        
    } catch (error) {
        debug('Erreur de vérification du jeton JWT:', error);
        return errorHandler._401(error, req, res);
    };
},
};

module.exports = authMiddleware;