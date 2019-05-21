const express = require('express');
const { auth } = require('../../middleware');
const { sendSuccess } = require('../utils');
const router = express.Router();

const User = require('../../models/User');

/**
 * @route GET api/auth
 * @description Test Route
 * @access Public
 */
router.get('/', auth, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-password');

    sendSuccess(user, res);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
