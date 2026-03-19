/* eslint-disable no-unused-vars */
const jwt = require('jsonwebtoken')
const { User } = require('../models')
const { success, unAuthorized, comparePassword, logger } = require('../utils')
const { generateTokenPair } = require('../utils/security')

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user || !(await comparePassword(password, user.password))) {
      return unAuthorized(res, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = generateTokenPair(user)

    user.refreshToken = refreshToken
    await user.save()

    return success(res, 'Login successful', {
      accessToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, _next) => {
  try {
    const { token } = req.body
    if (!token) return unAuthorized(res, 'Refresh token is required')

    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)

    const user = await User.findOne({
      where: { id: decoded.id, refreshToken: token },
    })

    if (!user) {
      logger.warn(
        `Refresh attempt with invalid/revoked token for User ID: ${decoded.id}`
      )
      return unAuthorized(
        res,
        'Session expired or invalid. Please login again.'
      )
    }

    const { accessToken, refreshToken } = generateTokenPair(user)

    user.refreshToken = refreshToken
    await user.save()

    return success(res, 'Token refreshed successfully', { accessToken })
  } catch (error) {
    logger.error('Refresh token expired or tampered with')
    return unAuthorized(res, 'Refresh token expired. Please login again.')
  }
}

const logout = async (req, res, next) => {
  try {
    const { id } = req.user
    await User.update({ refreshToken: null }, { where: { id } })
    return success(res, 'Logged out successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = { login, refreshToken, logout }
