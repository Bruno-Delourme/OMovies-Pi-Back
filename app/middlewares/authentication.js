const debug = require('debug')('app:middleware');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const authMiddleware = {

  authMiddleware(req, res, next) {
    debug('authentication middleware controller called');
    
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Jetons JWT manquant' });
    };

    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decodedToken.user;
        next(); 
        
    } catch (error) {
        console.error('Erreur de vérification du jeton JWT:', error);
        return res.status(401).json({ message: 'Jetons JWT invalide' });
    };
},
};

module.exports = authMiddleware;