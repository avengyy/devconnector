const express = require('express');
const router = express.Router();

/**
 * @route GET api/users
 * @description Test Route
 * @access Public
 */
router.get('/', (req, res) => {
  res.send('Users OK');
});

module.exports = router;
