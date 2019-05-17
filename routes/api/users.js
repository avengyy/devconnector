const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const { sendSuccess, sendFailure } = require('../utils');
const { jwtSecret } = require('../../config');

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

    const { name, email, password } = req.body;

    try {
      // 1. Check if user exist
      let user = await User.findOne({ email });

      if (user) {
        return sendFailure([{ msg: 'User already exists' }], res);
      }

      // 2. Get user avatar
      const avatar = gravatar.url(email, {
        s: '200',
        r: 'pg',
        d: 'mm'
      });

      user = new User({
        name,
        email,
        avatar,
        password
      });

      // 3. Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // 4. Return access token
      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, jwtToken, { expiresIn: 3600 * 100 }, (err, token) => {
        if (err) throw err;

        return sendSuccess({ token }, res);
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
