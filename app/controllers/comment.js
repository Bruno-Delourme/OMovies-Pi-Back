const debug = require('debug')('app:controller');

const commentDataMapper = require('../models/comment');

const commentController = {

  async create(req, res) {
    debug('comment create controller called');

    const userId = req.params.id;
    const { content } = req.body;

    try {
      const createComment = await commentDataMapper.insert({ user_id: userId, content });
      res.json({ status: 'success', data: createComment });

    } catch (error) {
      debug('Error creating comment :', error);
      res.status(500).json({ status: 'error', message: 'Error creating comment.' });
    };
  },
};

module.exports = commentController;