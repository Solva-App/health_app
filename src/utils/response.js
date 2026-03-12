const StatusCode = require('http-status-codes')

function success(res, message, data = {}, code = 200) {
  return res.status(code).json({
    status: 'success',
    message,
    data,
  })
}

function error(res, message, code = 500) {
  return res.status(code).json({
    status: 'error',
    message,
  })
}

function notFound(res, message) {
  return res.status(404).json({
    status: 'error',
    message,
  })
}

function unAuthorized(res, message) {
  return res.status(401).json({
    status: 'error',
    message,
  })
}

function badRequest(res, message) {
  return res.status(400).json({
    status: 'error',
    message,
  })
}

module.exports = { success, error, notFound, unAuthorized, badRequest }
