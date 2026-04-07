const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')

const drugCategorySchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}

const DrugCategory = sequelize.define('DrugCategory', drugCategorySchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

const drugSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    unique: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  brandName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  imageUrl: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  dosage: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}

const Drug = sequelize.define('Drug', drugSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

Drug.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') logger.info('=> Drug model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing Drug')
  })

DrugCategory.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.info('=> DrugCategory model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing DrugCategory')
  })

module.exports = { Drug, DrugCategory }
