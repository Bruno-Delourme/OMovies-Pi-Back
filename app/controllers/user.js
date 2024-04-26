const debug = require('debug')('app:controller');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const errorHandler = require('../service/error.js');

const userDataMapper = require('../models/user.js');

const userController = {

  // Allows you to create a user
  async create(req, res) {
    debug('user create controller called');

    const { pseudo, email, birthday, password } = req.body;

    // Check if user with same pseudo or email already exists
    const existingUser = await userDataMapper.findByPseudoOrEmail( pseudo, email );

    if (existingUser) {
      return errorHandler._400('A user with this nickname or email address already exists.', req, res);
    };

    // Password encoding
    const hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));

    // Insert a new user into the database
    const createdUser = await userDataMapper.insert({ pseudo, email, birthday, password: hashedPassword });

    res.json({ status: 'success', data: createdUser });
  },

  // Allows you to connect
  async login(req, res) {
    debug('user login controller called');

    // Attempting to find the user based on the provided credentials
    const result = await userDataMapper.findUser(req.body);

    // If no user is found, return an unauthorized response
    if (!result) {
      return errorHandler._401('No users found with specified nickname', req, res);
    };

    // Comparing the provided password with the hashed password stored in the database
    const isEqual = await bcrypt.compare(req.body.password, result.password);
    debug(isEqual);

    // If the passwords match, generate a JWT token for authentication
    if (isEqual) {
      // Removing the hashed password from the user data
      delete result.password;

      // Generating a JWT token with user data and the secret key
      const token = jwt.sign({ user: result }, process.env.JWT_SECRET);

      // Sending a success response with user data and the token
      res.json({ status: 'success', data: { user: result, token }});
    };
  },

  // Allows you to display a user
  async show(req, res) {
    debug('user show controller called');

    const { pseudo } = req.body;

    // Attempting to find the user based on the provided credentials
    const result = await userDataMapper.showUser({ pseudo });

    // If no user is found, return an error
    if (!result) {
      return errorHandler._401('No users found with specified nickname', req, res);

    } else {
      // Sending a success response with user data and the token
      res.json({ status: 'success', data: result});
    };
  },

  // Allows you to delete a user
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

  // Allows you to modify a user's information
  async update(req, res) {
    debug('user update controller called');
    
    const { pseudo, email, birthday, password } = req.body;
    const { id } = req.params

    let userData = {};
    let hashedPassword;
    const updated_at = new Date(); // Getting the current date for the updated_at field

    // Checking if each field is defined and updating the userData object accordingly
    if (pseudo !== undefined) {
      userData.pseudo = pseudo;
    };
    if (email !== undefined) {
      userData.email = email;
    };
    if (birthday !== undefined) {
      userData.birthday = birthday;
    };
    if (password !== undefined) {
      // Hashing the new password using bcrypt with the provided salt value
      hashedPassword = await bcrypt.hash(password, parseInt(process.env.PASSWORD_SALT));
      userData.password = hashedPassword;
    };
        
    userData.updated_at = updated_at; // Adding the updated_at field to userData
        
    // Updating the user data in the database using the userDataMapper
    const updatedUser = await userDataMapper.update({ id, pseudo, email, birthday, password: hashedPassword, updated_at });
    const token = jwt.sign({ user: updatedUser }, process.env.JWT_SECRET);
        
    res.json({ status: 'success', data: updatedUser, token });
  },
};

module.exports = userController;