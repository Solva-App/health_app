const { forbidden, unAuthorized } = require('../utils/response')

const isVerified = (req, res, next) => {
  if (!req.user) {
    return unAuthorized(res, 'Authentication required')
  }

  if (!req.user.isVerified) {
    return forbidden(res, 'Please verify your account to access this feature.')
  }

  next()
}

module.exports = isVerified
