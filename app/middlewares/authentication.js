const debug = require('debug')('app:middleware');
require('dotenv').config();

const errorHandler = require('../service/error.js');
const jwt = require('jsonwebtoken');

const authMiddleware = {

  authMiddleware(req, res, next) {
    debug('authentication middleware controller called');
    
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        errorHandler._401('Missing token', req, res);
    };

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken.user;
        next(); 
        
    } catch (error) {
        errorHandler._401('JWT token verification error', req, res);
    };
},
};

module.exports = authMiddleware;