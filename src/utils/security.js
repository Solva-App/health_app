const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')

const generateTokenPair = (user) => {
  const accessToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRY }
  )

  const refreshToken = jwt.sign(
    { id: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRY }
  )

  return { accessToken, refreshToken }
}

const hashPassword = async (password) => await bcrypt.hash(password, 10)

const comparePassword = async (password, hashed) =>
  await bcrypt.compare(password, hashed)

module.exports = { generateTokenPair, hashPassword, comparePassword }
