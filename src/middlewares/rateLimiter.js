const { rateLimit } = require('express-rate-limit')
const { forbidden } = require('../utils/response')

const isProduction = process.env.NODE_ENV === 'production'

const limiter = isProduction
  ? rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      standardHeaders: true,
      legacyHeaders: false,
      handler: (req, res) => {
        return forbidden(
          res,
          `Too many requests. Please try again after 15 minutes.`
        )
      },
    })
  : (req, res, next) => next()

const authLimiter = isProduction
  ? rateLimit({
      windowMs: 60 * 60 * 1000,
      limit: 10,
      handler: (req, res) => {
        return forbidden(
          res,
          'Too many login attempts. Please try again in an hour.'
        )
      },
    })
  : (req, res, next) => next()

module.exports = { limiter, authLimiter }
