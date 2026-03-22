const User = require('../models/user.model')
const { success, notFound } = require('../utils/response')

const getUser = async (req, res, next) => {
  try {
    const { id } = req.user
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] }
    });

    if (!user) {
      return notFound(res, 'User not found')
    }

    return success(res, user)
  } catch (error) {
    next(error)
  }
}

module.exports = { getUser }

