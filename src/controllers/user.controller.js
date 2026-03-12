const { User } = require('../models')

exports.getUsers = async (req, res) => {
  try {
    const users = await User.findAll()

    res.json({
      message: 'Users fetched successfully',
      data: users,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
