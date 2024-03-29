const debug = require("debug")("app:controller");
const bcrypt = require("bcrypt");
const userDataMapper = require("../../models/user.js");

const userController = {

  async create(req, res) {
    debug('user create controller called');

    const { pseudo, email, date_of_birth, password } = req.body;

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await userDataMapper.insert({ pseudo, email, date_of_birth, hashed_password: hashedPassword });
      res.json({ status: 'success', data: createdUser });

    } catch (error) {
      debug('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' });
    }
    
    
  },
};

module.exports = userController;