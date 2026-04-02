const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')

const prescriptionSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}

const Prescription = sequelize.define('Prescription', prescriptionSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

const prescriptionItemSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  prescriptionId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  drugId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  instructions: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  duration: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}

const PrescriptionItem = sequelize.define('PrescriptionItem', prescriptionItemSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

Prescription.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.info('=> Prescription model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing Prescription')
  })

PrescriptionItem.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.info('=> PrescriptionItem model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing PrescriptionItem')
  })

module.exports = { Prescription, PrescriptionItem }
