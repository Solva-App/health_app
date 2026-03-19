const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')

const userSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  refreshToken: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}

const User = sequelize.define('User', userSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

User.sync({ alter: true })
  .then(() => {
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV.toLowerCase() === 'production'
    )
      logger.info('=> User model synced')
  })
  .catch(() => {
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV.toLowerCase() === 'production'
    )
      logger.error('Error while syncing User')
  })

module.exports = User
