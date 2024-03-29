const debug = require("debug")("app:controller");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userDataMapper = require("../../models/user.js");

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
    console.log(result);

    if (!result) {
      debug('Aucun utilisateur trouvé avec le pseudo spécifié');
      return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
  }

    const isEqual = await bcrypt.compare(req.body.password, result.hashed_password);
    debug(isEqual);

    if(isEqual) {
      delete result.hashed_password;

      const token = jwt.sign( result, process.env.JWT_SECRET);

      res.json({ status: 'success', data: result, token });

    } else {
      debug('Erreur lors de la connexion :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la connexion.' });
    };
  },
};

module.exports = userController;