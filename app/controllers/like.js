const debug = require('debug')('app:controller');

const likeDataMapper = require('../models/like.js');

const likeController = {

  async create(req, res) {
    debug('like create controller called');

    const userId = req.params.id;

    try {
      // Check if the user has already voted
      const existingLike = await likeDataMapper.findLike(userId)

      if (existingLike) {
        return res.status(400).json({ status: 'error', message: 'You have already voted.' });
      };

      // Insert a new like into the database
      const like = await likeDataMapper.insert(userId);
      res.json({ status: 'success', data: like });

    } catch (error) {
      debug('Error when liking the site :', error);
      res.status(500).json({ status: 'error', message: 'Error when liking the site.' });
    };
  },

  async showTotalLikes(_, res) {
    debug('like show controller called');

    const result = await likeDataMapper.showTotalLikes();

    if (!result) {
      debug('No likes recorded.');
      return res.status(401).json({ status: 'error', message: 'No likes recorded.' });

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