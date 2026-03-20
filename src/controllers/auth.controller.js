const jwt = require('jsonwebtoken')
const User = require('../models/user.model')
const logger = require('../utils/logger')
const { success, created, unAuthorized, conflict } = require('../utils/response')
const { generateTokenPair, hashPassword, comparePassword } = require('../utils/security')
const { sendWelcomeEmail } = require('../utils/email')

const register = async (req, res, next) => {
  try {
    const { userName, email, password } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return conflict(res, 'Email is already registered')
    }

    const existingUsername = await User.findOne({ where: { userName } })
    if (existingUsername) {
      return conflict(res, 'Username is already taken')
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await User.create({
      userName,
      email,
      password: hashedPassword,
    })

    await sendWelcomeEmail(newUser);

    logger.info(`New user registered: ${email}`)

    return created(res, 'User registered successfully', {
      user: {
        id: newUser.id,
        userName: newUser.userName,
        email: newUser.email,
      },
    })
  } catch (err) {
    next(err)
  }
}

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ where: { email } })

    if (!user) {
      return unAuthorized(res, 'Invalid credentials')
    }

    const isMatch = await comparePassword(password, user.password)
    if (!isMatch) {
      return unAuthorized(res, 'Invalid credentials')
    }

    const { accessToken, refreshToken } = generateTokenPair(user)

    user.refreshToken = refreshToken
    await user.save()

    return success(res, 'Login successful', {
      accessToken,
      refreshToken,
      expiresIn: process.env.JWT_ACCESS_EXPIRY,
    })
  } catch (error) {
    next(error)
  }
}

const refreshToken = async (req, res, next) => {
  try {
    const { token } = req.body
    if (!token) {
      return unAuthorized(res, 'Refresh token is required')
    }

    let decoded
    try {
      decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET)
    } catch (err) {
      return unAuthorized(res, 'Refresh token expired or tampered with')
    }

    const user = await User.findOne({
      where: { id: decoded.id, refreshToken: token },
    })

    if (!user) {
      logger.warn(`Invalid refresh attempt for User ID: ${decoded.id}`)
      return unAuthorized(res, 'Session expired or invalid. Please login again.')
    }

    const tokens = generateTokenPair(user)

    user.refreshToken = tokens.refreshToken
    await user.save()

    return success(res, 'Token refreshed successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken
    })
  } catch (error) {
    next(error)
  }
}

const logout = async (req, res, next) => {
  try {
    const { id } = req.user

    if (!id) {
      return unAuthorized(res, 'Authentication required')
    }

    await User.update({ refreshToken: null }, { where: { id } })

    return success(res, 'Logged out successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = { register, login, refreshToken, logout }