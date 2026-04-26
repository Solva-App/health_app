const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')

const addressSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  street: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isDefault: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}

const Address = sequelize.define('Address', addressSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

Address.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.info('=> Address model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing Address')
  })

module.exports = Address
