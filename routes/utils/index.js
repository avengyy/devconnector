const { Request, Response, NextFunction } = require('express');

/**
 * Send success response
 * @param {*} data
 *  @param {Response} res
 */
const sendSuccess = (data, res) =>
  res.status(200).json({
    status: 'success',
    data
  });

/**
 * Send failure response
 * @param {*} data
 * @param {Response} res
 */
const sendFailure = (data, res) =>
  res.status(400).json({
    status: 'fail',
    data
  });

module.exports = {
  sendFailure,
  sendSuccess
};
