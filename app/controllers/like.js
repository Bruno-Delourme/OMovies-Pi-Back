const debug = require('debug')('app:controller');
const errorHandler = require('../service/error.js');

const likeDataMapper = require('../models/like.js');

const likeController = {

  async create(req, res) {
    debug('like create controller called');

    const userId = req.params.id;

    try {
      // Check if the user has already voted
      const existingLike = await likeDataMapper.findLike(userId)

      if (existingLike) {
        return errorHandler._400('You are already vote', req, res);
      };

      // Insert a new like into the database
      const like = await likeDataMapper.insert(userId);
      res.json({ status: 'success', data: like });

    } catch (error) {
      debug('Error when liking the site :', error);
      errorHandler._500(error, req, res);
    };
  },

  async showTotalLikes(_, res) {
    debug('like show controller called');

    const result = await likeDataMapper.showTotalLikes();

    if (!result) {
      debug('No likes recorded.');
      return errorHandler._401(error, req, res);

    } else {
      res.json({ status: 'success', data: result});
    };
  },

  async delete(req, res) {
    debug('like delete controller called');

    const userId = req.params.id;

    // Delete a like from the database
    const isRemoved = await likeDataMapper.delete(userId);

    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
  },
};

module.exports = likeController;