const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')
const User = require('./user.model')

const otpSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true,
  },
}

const Otp = sequelize.define('Otp', otpSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

Otp.belongsTo(User, { foreignKey: 'userId', as: 'user', onDelete: 'CASCADE' })
User.hasOne(Otp, { foreignKey: 'userId', as: 'otp' })

Otp.sync({ alter: true })
  .then(() => {
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV.toLowerCase() === 'production'
    )
      logger.info('=> Otp model synced')
  })
  .catch(() => {
    if (
      process.env.NODE_ENV &&
      process.env.NODE_ENV.toLowerCase() === 'production'
    )
      logger.error('Error while syncing Otp')
  })

module.exports = Otp
