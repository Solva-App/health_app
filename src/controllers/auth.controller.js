const jwt = require('jsonwebtoken')
const { sequelize } = require('../config/db')
const User = require('../models/user.model')
const Otp = require('../models/otp.model')
const logger = require('../utils/logger')
const {
  success,
  created,
  unAuthorized,
  conflict,
  badRequest,
  notFound,
} = require('../utils/response')
const {
  generateTokenPair,
  hashPassword,
  comparePassword,
} = require('../utils/security')
const {
  sendWelcomeEmail,
  sendOtpEmail,
  sendResetPasswordEmail,
} = require('../utils/email')
const { generateOtpData } = require('../utils/generate')

const register = async (req, res, next) => {
  const t = await sequelize.transaction()

  try {
    const { fullName, email, password } = req.body

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      await t.rollback()
      return conflict(res, 'Email is already registered')
    }

    const hashedPassword = await hashPassword(password)

    const newUser = await User.create(
      {
        fullName,
        email,
        password: hashedPassword,
      },
      { transaction: t }
    )

    const { code, expiresAt } = generateOtpData(10)

    await Otp.create(
      {
        userId: newUser.id,
        code,
        expiresAt,
      },
      { transaction: t }
    )

    await sendOtpEmail(newUser, code)

    await t.commit()

    logger.info(`New user registered and OTP sent: ${email}`)

    return created(
      res,
      'User registered successfully. Please check your email for the verification code.',
      {
        user: {
          id: newUser.id,
          fullName: newUser.fullName,
          email: newUser.email,
        },
      }
    )
  } catch (err) {
    if (!t.finished) await t.rollback()
    next(err)
  }
}

const verifyCode = async (req, res, next) => {
  const t = await sequelize.transaction()

  try {
    const { email, code } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      await t.rollback()
      return notFound(res, 'User not found')
    }

    const otpRecord = await Otp.findOne({ where: { userId: user.id } })

    if (!otpRecord) {
      await t.rollback()
      return badRequest(res, 'No verification code found for this user')
    }

    if (Number(otpRecord.code) !== Number(code)) {
      await t.rollback()
      return badRequest(res, 'Invalid verification code')
    }

    const now = new Date()
    if (now > otpRecord.expiresAt) {
      await t.rollback()
      return badRequest(
        res,
        'Verification code has expired. Please request a new one.'
      )
    }

    await user.update({ isVerified: true }, { transaction: t })
    await otpRecord.destroy({ transaction: t })

    sendWelcomeEmail(user)

    await t.commit()

    return success(res, 'Account verified successfully. You can now log in.')
  } catch (err) {
    if (!t.finished) await t.rollback()
    next(err)
  }
}

const resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ where: { email, isVerified: false } })
    if (!user) {
      return notFound(res, 'User not found')
    }

    if (user.isVerified) {
      return badRequest(res, 'This account is already verified')
    }

    const { code, expiresAt } = generateOtpData(10)

    await Otp.upsert({
      userId: user.id,
      code,
      expiresAt,
    })

    await sendOtpEmail(user, code)

    return success(res, 'A new verification code has been sent to your email')
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
      logger.error(err)
      return unAuthorized(res, 'Refresh token expired or tampered with')
    }

    const user = await User.findOne({
      where: { id: decoded.id, refreshToken: token },
    })

    if (!user) {
      logger.warn(`Invalid refresh attempt for User ID: ${decoded.id}`)
      return unAuthorized(
        res,
        'Session expired or invalid. Please login again.'
      )
    }

    const tokens = generateTokenPair(user)

    user.refreshToken = tokens.refreshToken
    await user.save()

    return success(res, 'Token refreshed successfully', {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    })
  } catch (error) {
    next(error)
  }
}

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ where: { email } })

    if (!user) {
      return success(
        res,
        'If an account exists with that email, a code has been sent.'
      )
    }

    const { code, expiresAt } = generateOtpData(15)

    await Otp.upsert({
      userId: user.id,
      code,
      expiresAt,
    })

    await sendResetPasswordEmail(user, code)

    return success(
      res,
      'If an account exists with that email, a code has been sent.'
    )
  } catch (err) {
    next(err)
  }
}

const resetPassword = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { email, code, newPassword } = req.body

    const user = await User.findOne({ where: { email } })
    if (!user) {
      await t.rollback()
      return badRequest(res, 'Invalid request')
    }

    const otpRecord = await Otp.findOne({ where: { userId: user.id, code } })

    if (!otpRecord || new Date() > otpRecord.expiresAt) {
      await t.rollback()
      return badRequest(res, 'Invalid or expired reset code')
    }

    const hashedPassword = await hashPassword(newPassword)
    await user.update({ password: hashedPassword }, { transaction: t })

    await otpRecord.destroy({ transaction: t })

    await t.commit()
    return success(
      res,
      'Password has been reset successfully. You can now log in.'
    )
  } catch (err) {
    if (!t.finished) await t.rollback()
    next(err)
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

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  verifyCode,
  resendOtp,
  forgotPassword,
  resetPassword,
}
