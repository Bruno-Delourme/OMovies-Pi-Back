const debug = require("debug")("app:controller");
const userDataMapper = require("../../models/user.js");

const userController = {

  async create(req, res) {
    debug('user create controller called');
    const createdUser = await userDataMapper.insert(req.body);
    Response.json({ status: 'success', data: createdUser });
  },
};

module.exports = userController;