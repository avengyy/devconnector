const express = require('express');
const jwt = require('jsonwebtoken');
const { sendAuthFailure } = require('../routes/utils');

/**
 * Authenticate
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const auth = (req, res, next) => {
  // 1. Get token from header
  const token = req.header('x-auth-token');

  // 2. Check if no token
  if (!token) {
    return sendAuthFailure(res, { msg: 'Unauthorized' });
  }

  // 3. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded.user;

    next();
  } catch (error) {
    return sendAuthFailure(res, { msg: 'Token is not valid' });
  }
};

/**
 * Log errors
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const logErrors = (err, _req, _res, next) => {
  if (err.message) console.error(err.message);
  if (err.stack) console.error(err.stack);
  next(err);
};

/**
 * Send client errors
 * @param {*} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const clientErrorHandler = (err, req, res, next) => {
  if (req.xhr) {
    res.status(500).send({ error: 'Some error occured!' });
  } else {
    next(err);
  }
};

/**
 * Send error reponse
 * @param {*} err
 * @param {express.Request} req
 * @param {express.Response} res
 * @param {express.NextFunction} next
 */
const errorHandler = (err, _req, res, _next) => {
  res.status(500);
  res.send('Server Error');
};

module.exports = {
  auth,
  logErrors,
  clientErrorHandler,
  errorHandler
};
