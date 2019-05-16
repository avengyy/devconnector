const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator/check');
const { sendSuccess, sendFailure } = require('../utils');

const User = require('../../models/User');

/**
 * @route POST api/users
 * @description Register user
 * @access Public
 */
router.post(
  '/',
  [
    check('name', 'Name is required')
      .not()
      .isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(errors.array(), res);
    }

    // 1. Check if user exist
    const { name, email, password } = req.body;

    try {
      await User.findOne();
      // 2. Get user avatar

      // 3. Hash password

      // 4. Return access token
      sendSuccess('User OK', res);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
