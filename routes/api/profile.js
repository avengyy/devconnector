const express = require('express');
const router = express.Router();
const { auth } = require('../../middleware');
const { sendSuccess, sendFailure } = require('../utils');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

/**
 * @route GET api/profile/me
 * @description Get current user profile
 * @access Private
 */
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return sendFailure(res, { msg: 'There is no profile for this user' });
    }

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
