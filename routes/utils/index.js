/**
 * Send success response
 * @param {Object} data
 * @param {Response} res
 */
const sendSuccess = (res, data) =>
  res.status(200).json({
    status: 'success',
    data
  });

/**
 * Send failure response
 * @param {Object} data
 * @param {Response} res
 */
const sendFailure = (res, error) =>
  res.status(400).json({
    status: 'fail',
    error
  });

/**
 * Send failure response
 * @param {Object} data
 * @param {Response} res
 */
const sendAuthFailure = (res, error) =>
  res.status(401).json({
    status: 'fail',
    error
  });

module.exports = {
  sendAuthFailure,
  sendFailure,
  sendSuccess
};
