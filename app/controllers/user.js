const debug = require('debug')('app:controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userDataMapper = require('../models/user.js');

const userController = {

  async create(req, res) {
    debug('user create controller called');

    const { pseudo, email, date_of_birth, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
      const createdUser = await userDataMapper.insert({ pseudo, email, date_of_birth, hashed_password: hashedPassword });
      res.json({ status: 'success', data: createdUser });

    } catch (error) {
      debug('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' });
    }
  },

  async login(req, res) {
    debug('user login controller called');

    const result = await userDataMapper.findUser(req.body);

    if (!result) {
      debug('Aucun utilisateur trouvé avec le pseudo spécifié');
      return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
  }

    const isEqual = await bcrypt.compare(req.body.password, result.hashed_password);
    debug(isEqual);

    if(isEqual) {
      delete result.hashed_password;

      const token = jwt.sign({ user: result }, process.env.JWT_SECRET);

      res.json({ status: 'success', data: { utilisateur: result, token } });

    } else {
      debug('Erreur lors de la connexion :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la connexion.' });
    };
  },

  async delete(req, res) {
    debug('user delete controller called');

    const { id } = req.params;
    
    const isRemoved = await userDataMapper.delete(id);
    
    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
  },

  async update(req, res) {
    debug('user update controller called');
    
    const {id, pseudo, email, date_of_birth, password } = req.body;

    let userData = {};
    let hashedPassword;
    const updated_at = new Date();

    try {
      if (pseudo !== undefined) {
      userData.pseudo = pseudo;
     }
      if (email !== undefined) {
      userData.email = email;
     }
      if (date_of_birth !== undefined) {
      userData.date_of_birth = date_of_birth;
     }
      if (password !== undefined) {
      hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
      userData.password = hashedPassword;
     }
     
      userData.updated_at = updated_at; 
      
      const updatedUser = await userDataMapper.update({id, pseudo, email, date_of_birth, hashed_password: hashedPassword, updated_at });
      res.json({ status: 'success', data: updatedUser });

  } catch (error) {
    debug('Erreur lors de la modification de l\'utilisateur :', error);
    res.status(500).json({ status: 'error', message: 'Erreur lors de la modification de l\'utilisateur.' });
  };
  },
};

module.exports = userController;