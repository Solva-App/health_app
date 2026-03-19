const { DataTypes } = require('sequelize')
const { sequelize } = require('../database/db')
const logger = require('../utils/logger')

const userSchema = {
  id: {
    type: DataTypes.UUID,
    default: DataTypes.UUID4,
    primaryKey: true,
    unique: true,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
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
