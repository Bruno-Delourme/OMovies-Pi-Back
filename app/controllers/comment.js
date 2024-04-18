const debug = require('debug')('app:controller');
const errorHandler = require('../service/error.js');

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

  async show(req, res) {
    debug('comment show controller called');

    const result = await commentDataMapper.show();

    if (!result) {
      debug('No comment recorded.');
      return res.status(401).json({ status: 'error', message: 'No comment recorded.' });

    } else {
      res.json({ status: 'success', data: result });
    };
  },

  async update(req, res) {
    debug('comment update controller called');

    const { content, userId } = req.body;
    const commentId = req.params.id;

    let commentData = {};
    const updated_at = new Date();

    try {
      commentData.user_id = userId;

      if (content !== undefined) {
        return errorHandler._400('Incomplete data', req, res);
      };

      commentData.updated_at = updated_at;

      const updatedComment = await commentDataMapper.update({ id: commentId })
    } catch (error) {

    }
  }
};

module.exports = commentController;