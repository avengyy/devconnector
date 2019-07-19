const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware');
const { sendSuccess, sendFailure } = require('../utils');
const { check, validationResult } = require('express-validator/check');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route POST api/posts
 * @description Create a post
 * @access Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('text', 'Text is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(res, errors.array());
    }

    try {
      const user = await User.findById(req.user.id).select('-password');

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id
      });

      const post = await newPost.save();

      sendSuccess(res, post);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route GET api/posts
 * @description Get all post
 * @access Private
 */
router.get('/', auth, async (req, res) => {
  try {
    // Find posts and sort by most recent
    const posts = await Post.find().sort({ date: -1 });

    sendSuccess(res, posts);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET api/posts/:id
 * @description Get post by id
 * @access Private
 */
router.get('/:id', auth, async (req, res) => {
  try {
    // Find post by id and sort by most recent
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendFailure(res, { msg: 'Post not found' });
    }

    sendSuccess(res, post);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return sendFailure(res, { msg: 'Post not found' });
    }
    next(error);
  }
});

/**
 * @route DELETE api/posts/:id
 * @description Delete a post
 * @access Private
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    // Find post by id and sort by most recent
    const post = await Post.findById(req.params.id);

    if (!post) {
      return sendFailure(res, { msg: 'Post not found' });
    }

    // Check user
    if (post.user.toString() !== req.user.id) {
      return sendFailure(res, { msg: 'User not authorized' });
    }

    await post.remove();

    sendSuccess(res, { msg: 'Post removed' });
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return sendFailure(res, { msg: 'Post not found' });
    }
    next(error);
  }
});

module.exports = router;
