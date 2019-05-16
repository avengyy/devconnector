const express = require('express');
const router = express.Router();

/**
 * @route GET api/auth
 * @description Test Route
 * @access Public
 */
router.get('/', (req, res) => {
  res.send('Auth OK');
});

module.exports = router;
