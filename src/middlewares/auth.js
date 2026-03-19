const jwt = require('jsonwebtoken')
const { unAuthorized } = require('../utils/response')

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret)
  } catch (err) {
    return err
  }
}

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return unAuthorized(res, 'Access denied. No token provided.')
  }

  const token = authHeader.split(' ')[1]
  const decoded = verifyToken(token, process.env.JWT_ACCESS_SECRET)

  if (!decoded) {
    return unAuthorized(res, 'Invalid or expired access token.')
  }

  req.user = decoded
  next()
}

module.exports = auth
