/* eslint-disable no-unused-vars */
const logger = require('../utils/logger')
const { serverError, conflict, badRequest } = require('../utils/response')

const logError = (err, req) => {
  const message = err.message || 'Internal Server Error'
  logger.error(`${req.method} ${req.url} - ${message}`, err.stack)
}

const handleSequelizeError = (err, res) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return conflict(res, 'Duplicate entry detected: This record already exists')
  }

  if (err.name === 'SequelizeConnectionRefusedError') {
    return serverError(res, 'Database connection refused', 503)
  }

  return null
}

const handleError = (err, req, res, _next) => {
  logError(err, req)

  const dbErrorResponse = handleSequelizeError(err, res)
  if (dbErrorResponse) return dbErrorResponse

  const statusCode = err.status || 500
  const message = process.env.NODE_ENV === 'production'
    ? 'An internal server error occurred'
    : err.message

  return serverError(res, message, statusCode)
}

module.exports = handleError