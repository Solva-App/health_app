const { badRequest, serverError } = require('../utils/response')
const logger = require('../utils/logger')

const validate = (schema) => {
  return (req, res, next) => {
    const bodyToValidate = req.body || {}

    if (!schema) {
      logger.error('Validation Error: Schema is undefined for this route.')
      return serverError(res, 'Internal Validation Error')
    }

    const { error, value } = schema.validate(bodyToValidate, {
      abortEarly: false,
      stripUnknown: true,
    })

    if (error) {
      const errorMessage = error.details.map((detail) => detail.message.replace(/"/g, '')).join(', ')

      return badRequest(res, errorMessage)
    }

    req.body = value
    next()
  }
}

module.exports = validate
