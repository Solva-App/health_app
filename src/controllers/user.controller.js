const { sequelize } = require('../config/db')
const User = require('../models/user.model')
const { success, notFound, badRequest, unAuthorized } = require('../utils/response')
const { comparePassword, hashPassword } = require('../utils/security')

const getUser = async (req, res, next) => {
  try {
    const { id } = req.user
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    })

    if (!user) {
      return notFound(res, 'User not found')
    }

    return success(res, 'User profile retrieved', user)
  } catch (error) {
    next(error)
  }
}

const updateUser = async (req, res, next) => {
  try {
    const userId = req.user.id

    const { fullName, phoneNumber } = req.body

    const user = await User.findByPk(userId)

    if (!user) {
      return notFound(res, 'User not found')
    }

    await user.update({
      fullName: fullName || user.fullName,
      phoneNumber: phoneNumber || user.phoneNumber,
    })

    return success(res, 'Profile updated successfully', {
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    })
  } catch (err) {
    next(err)
  }
}

const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    const user = await User.findByPk(req.user.id)

    const isMatch = await comparePassword(currentPassword, user.password)
    if (!isMatch) {
      return badRequest(res, 'The current password you entered is incorrect')
    }

    if (newPassword === currentPassword) {
      return badRequest(res, 'The new password must be different from the current password')
    }

    const hashedPassword = await hashPassword(newPassword)
    await user.update({ password: hashedPassword })

    return success(res, 'Password updated successfully')
  } catch (err) {
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

const deleteAccount = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const user = await User.findByPk(req.user.id)

    if (!user) {
      await t.rollback()
      return notFound(res, 'User not found')
    }

    await user.destroy({ transaction: t })

    await t.commit()
    return success(res, 'Account deleted successfully.')
  } catch (err) {
    if (t && !t.finished) await t.rollback()
    next(err)
  }
}

module.exports = {
  getUser,
  updateUser,
  changePassword,
  logout,
  deleteAccount
}
