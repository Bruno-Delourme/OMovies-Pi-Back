const debug = require('debug')('app:controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userDataMapper = require('../models/user.js');

const userController = {

  // Function that creates a user
  async create(req, res) {
    debug('user create controller called');

    const { pseudo, email, date_of_birth, password } = req.body;

    try {
      // Password encoding
      const hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
      // Insert a new user into the database
      const createdUser = await userDataMapper.insert({ pseudo, email, date_of_birth, hashed_password: hashedPassword });
      res.json({ status: 'success', data: createdUser });

    } catch (error) {
      debug('Erreur lors de la création de l\'utilisateur :', error);
      res.status(500).json({ status: 'error', message: 'Erreur lors de la création de l\'utilisateur.' });
    };
  },

  // Function that allows you to connect
  async login(req, res) {
    debug('user login controller called');

    // Attempting to find the user based on the provided credentials
    const result = await userDataMapper.findUser(req.body);

    // If no user is found, return an unauthorized response
    if (!result) {
      debug('Aucun utilisateur trouvé avec le pseudo spécifié');
      return res.status(401).json({ status: 'error', message: 'Nom d\'utilisateur ou mot de passe incorrect.' });
    };

    // Comparing the provided password with the hashed password stored in the database
    const isEqual = await bcrypt.compare(req.body.password, result.hashed_password);
    debug(isEqual);

    // If the passwords match, generate a JWT token for authentication
    if (isEqual) {
      // Removing the hashed password from the user data
      delete result.hashed_password;

      // Generating a JWT token with user data and the secret key
      const token = jwt.sign({ user: result }, process.env.JWT_SECRET);

      // Sending a success response with user data and the token
      res.json({ status: 'success', data: { user: result, token } });

  } else {
      // If the passwords don't match, return an internal server error response
      debug('Error during login:', error);
      res.status(500).json({ status: 'error', message: 'Error during login.' });
  };
  },

  // Function that deletes a user
  async delete(req, res) {
    debug('user delete controller called');

    const { id } = req.params;
    
    // Delete a user from the database
    const isRemoved = await userDataMapper.delete(id);
    
    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
  },

  // Function that allows you to modify a user's information
  async update(req, res) {
    debug('user update controller called');
    
    const { id, pseudo, email, date_of_birth, password } = req.body;

    let userData = {};
    let hashedPassword;
    const updated_at = new Date(); // Getting the current date for the updated_at field

    try {
        // Checking if each field is defined and updating the userData object accordingly
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
            // Hashing the new password using bcrypt with the provided salt value
            hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
            userData.password = hashedPassword;
        }
        
        userData.updated_at = updated_at; // Adding the updated_at field to userData
        
        // Updating the user data in the database using the userDataMapper
        const updatedUser = await userDataMapper.update({ id, pseudo, email, date_of_birth, hashed_password: hashedPassword, updated_at });
        
        res.json({ status: 'success', data: updatedUser });

    } catch (error) {
        debug('Error updating user:', error);
        res.status(500).json({ status: 'error', message: 'Error updating user.' });
    }
  },
};

module.exports = userController;