const express = require('express');
const router = express.Router();
const request = require('request');
const { auth } = require('../../middleware');
const { sendSuccess, sendFailure } = require('../utils');
const { check, validationResult } = require('express-validator/check');
const dotenv = require('dotenv');

const Profile = require('../../models/Profile');
const User = require('../../models/User');

dotenv.config();

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

/**
 * @route POST api/profile
 * @description Create or update a user profile
 * @access Private
 */
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required')
        .not()
        .isEmpty(),
      check('skills', 'Skills is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(res, errors.array());
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin
    } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(',').map(skill => skill.trim());
    }

    // Build social object
    profileFields.social = {};

    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (instagram) profileFields.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return sendSuccess(res, profile);
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();

      sendSuccess(res, profile);
    } catch (error) {
      console.error(error.message);
      next(error);
    }
  }
);

/**
 * @route GET api/profile
 * @description Get all profile
 * @access Public
 */
router.get('/', async (req, res, next) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar']);

    sendSuccess(res, profiles);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET api/profile/user/:user_id
 * @description Get profile by user ID
 * @access Public
 */
router.get('/user/:user_id', async (req, res, next) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id
    }).populate('user', ['name', 'avatar']);

    if (!profile) {
      return sendFailure(res, [{ msg: 'Profile not found' }]);
    }

    sendSuccess(res, profile);
  } catch (error) {
    if (error.kind === 'ObjectId') {
      return sendFailure(res, [{ msg: 'Profile not found' }]);
    } else {
      next(error);
    }
  }
});

/**
 * @route DELETE api/profile
 * @description Delete profile, user & posts
 * @access Private
 */
router.delete('/', auth, async (req, res, next) => {
  try {
    // TODO: Remove users posts

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    sendSuccess(res, { msg: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT api/profile/experience
 * @description Add profile experience
 * @access Private
 */
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required')
        .not()
        .isEmpty(),
      check('company', 'Company is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(res, errors.array());
    }

    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);

      await profile.save();

      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route DELETE api/profile/experience/:exp_id
 * @description Delete profile experience
 * @access Private
 */
router.delete('/experience/:exp_id', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.experience
      .map(item => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
});

/**
 * @route PUT api/profile/education
 * @description Add profile education
 * @access Private
 */
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required')
        .not()
        .isEmpty(),
      check('degree', 'Degree is required')
        .not()
        .isEmpty(),
      check('fieldofstudy', 'Field of study is required')
        .not()
        .isEmpty(),
      check('from', 'From date is required')
        .not()
        .isEmpty()
    ]
  ],
  async (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return sendFailure(res, errors.array());
    }

    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);

      await profile.save();

      sendSuccess(res, profile);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * @route DELETE api/profile/education/:edu_id
 * @description Delete profile education
 * @access Private
 */
router.delete('/education/:edu_id', auth, async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.education
      .map(item => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();

    sendSuccess(res, profile);
  } catch (error) {
    next(error);
  }
});

/**
 * @route GET api/profile/github/:username
 * @description Get user repos from Github
 * @access Public
 */
router.get('/github/:username', (req, res, next) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${
        process.env.GITHUB_CLIENT_ID
      }&client_secret=${process.env.GITHUB_SECRET}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' }
    };

    request(options, (error, response, body) => {
      if (error) {
        console.log(error);
        next(error);
      }

      if (response.statusCode !== 200) {
        return res.status(404).json({
          status: 'fail',
          data: {
            msg: 'No Github profile found'
          }
        });
      }

      sendSuccess(res, JSON.parse(body));
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
