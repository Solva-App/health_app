/* eslint-disable no-unused-vars */
const logger = require('../utils/logger')
const { sendError } = require('../utils/response')

const logError = (err, req, res) => {
  const message = err.message || 'Internal Server Error'
  const status = err.status || 500

  logger.error(`${req.method} ${req.url} - ${message}`, err.stack)
}

const handleUniqueConstraintError = (err, res) => {
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res
      .status(409)
      .json({ success: false, message: 'Duplicate entry detected' })
  }
}

const handleError = (err, req, res, _next) => {
  logError(err, req, res)
  handleUniqueConstraintError(err, res)
  return sendError(
    res,
    err.message || 'Internal Server Error',
    err.status || 500
  )
}

module.exports = handleError
