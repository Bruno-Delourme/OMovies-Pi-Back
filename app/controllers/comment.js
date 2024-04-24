const debug = require('debug')('app:controller');
const errorHandler = require('../service/error.js');

const commentDataMapper = require('../models/comment');

const commentController = {

  // Allows you to create a comment
  async create(req, res) {
    debug('comment create controller called');

    const userId = req.params.id;
    const { comment } = req.body;

    try {
      const createComment = await commentDataMapper.insert({ user_id: userId, content: comment });
      res.json({ status: 'success', data: createComment });

    } catch (error) {
      debug('Error creating comment :', error);
      errorHandler._500(error, req, res);
    };
  },

  // Allows you to display comments
  async show(req, res) {
    debug('comment show controller called');

    const result = await commentDataMapper.show();

    if (!result) {
      debug('No comment recorded.');
      return errorHandler._401('No comment recorded', req, res);

    } else {
      res.json({ status: 'success', data: result });
    };
  },

  // Allows you to edit a comment
  async update(req, res) {
    debug('comment update controller called');

    const { content, userId } = req.body;
    const commentId = req.params.id;

    const updated_at = new Date();

    try {
        // Data verification
        if (content === undefined) {
            return errorHandler._400('Incomplete data', req, res);
        }

        // Construction of the object containing the data to update
        const commentData = {
            id: commentId,
            content: content,
            user_id: userId,
            updated_at: updated_at
        };

        // Calling the comment update function
        const updatedComment = await commentDataMapper.update(commentData);
        
        res.status(200).json({ status: 'success', message: 'Comment updated successfully' });

    } catch (error) {
        debug('Error updating comment:', error);
        return errorHandler._500('Error updating comment', req, res);
    };
  },

  // Allows you to delete a comment
  async delete(req, res) {
    debug('comment delete controller called');

    const id = req.params.id;

    // Delete a comment from the database
    const isRemoved = await commentDataMapper.delete(id);

    if (isRemoved) {
      res.json({ status: 'success' });

    } else {
      res.json({ status: 'fail' });
    };
  },
};

module.exports = commentController;