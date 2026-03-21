const logger = require('../utils/logger');
const { serverError, conflict } = require('../utils/response');

const logError = (err, req) => {
  const message = err.message || 'Internal Server Error';
  if (process.env.NODE_ENV !== 'production' && !err.isOperational) {
    logger.error(`${req.method} ${req.url} - ${message}`, err.stack);
  } else {
    logger.error(`${req.method} ${req.url} - ${message}`);
  }
};

const handleSequelizeError = (err, res) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors ? err.errors[0].path : 'field';
    return conflict(res, `Duplicate entry: ${field} already exists`);
  }

  if (err.name === 'SequelizeConnectionRefusedError' || err.name === 'SequelizeConnectionError') {
    return serverError(res, 'Database connection failed', 503);
  }

  if (err.name === 'SequelizeDatabaseError') {
    return serverError(res, `Database Error: ${err.message}`, 500);
  }

  return null;
};

const handleError = (err, req, res) => {
  logError(err, req);

  const dbErrorResponse = handleSequelizeError(err, res);
  if (dbErrorResponse) return dbErrorResponse;

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'An unexpected error occurred';

  return serverError(res, message, statusCode);
};

module.exports = handleError;