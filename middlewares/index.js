/**
 * Log errors
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const logErrors = (err, _req, _res, next) => {
  console.error(err.stack);
  next(err);
};

/**
 * Send client errors
 * @param {*} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
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
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const errorHandler = (err, _req, res, _next) => {
  res.status(500);
  res.send('error', { error: err });
};

module.exports = {
  logErrors,
  clientErrorHandler,
  errorHandler
};
