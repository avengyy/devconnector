const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator/check');
const { auth } = require('../../middleware');
const { sendSuccess, sendFailure } = require('../utils');
const { jwtSecret } = require('../../config');

const User = require('../../models/User');

/**
 * @route GET api/auth
 * @description Test Route
 * @access Public
 */
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    sendSuccess(res, user);
  } catch (error) {
    next(error);
  }
});

/**
 * @route POST api/auth
 * @description Authenticate user and get access token
 * @access Public
 */
router.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(res, errors.array());
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return sendFailure(res, [{ msg: 'Invalid Credentials' }]);
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return sendFailure(res, [{ msg: 'Invalid Credentials' }]);
      }

      const payload = {
        user: {
          id: user.id
        }
      };

      jwt.sign(payload, jwtSecret, { expiresIn: 3600 * 100 }, (err, token) => {
        if (err) throw err;

        return sendSuccess(res, { token });
      });
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
