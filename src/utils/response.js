const { StatusCodes } = require('http-status-codes')

const send = (res, status, message, data = null, success = false) => {
  const response = {
    success,
    status,
    message,
  }
  if (data && (Object.keys(data).length > 0 || Array.isArray(data))) {
    response.data = data
  }
  return res.status(status).json(response)
}

const success = (
  res,
  message = 'Operation successful',
  data = {},
  code = StatusCodes.OK
) => {
  return send(res, code, message, data, true)
}

const created = (res, message = 'Resource created successfully', data = {}) => {
  return send(res, StatusCodes.CREATED, message, data, true)
}

const accepted = (
  res,
  message = 'Request accepted and processing',
  data = {}
) => {
  return send(res, StatusCodes.ACCEPTED, message, data, true)
}

const noContent = (res) => {
  return send(res, StatusCodes.NO_CONTENT)
}

const badRequest = (res, message = 'Invalid request data') => {
  return send(res, StatusCodes.BAD_REQUEST, message)
}

const unAuthorized = (res, message = 'Authentication required') => {
  return send(res, StatusCodes.UNAUTHORIZED, message)
}

const forbidden = (res, message = 'Permission denied') => {
  return send(res, StatusCodes.FORBIDDEN, message)
}

const notFound = (res, message = 'Resource not found') => {
  return send(res, StatusCodes.NOT_FOUND, message)
}

const conflict = (res, message = 'Resource already exists') => {
  return send(res, StatusCodes.CONFLICT, message)
}

const validationError = (res, message = 'Validation failed') => {
  return send(res, StatusCodes.UNPROCESSABLE_ENTITY, message)
}

const serverError = (
  res,
  message = 'An internal server error occurred',
  code = StatusCodes.INTERNAL_SERVER_ERROR
) => {
  return send(res, code, message)
}

module.exports = {
  send,
  success,
  created,
  accepted,
  noContent,
  badRequest,
  unAuthorized,
  forbidden,
  notFound,
  conflict,
  validationError,
  serverError,
}
