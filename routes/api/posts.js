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

module.exports = router;
