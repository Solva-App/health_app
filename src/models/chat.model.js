const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const logger = require('../utils/logger')

const chatSchema = {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  role: {
    type: DataTypes.ENUM('user', 'assistant'),
    allowNull: false,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}

const Chat = sequelize.define('Chat', chatSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() {},
    beforeUpdate() {},
    afterFind() {},
  },
})

Chat.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') logger.info('=> Chat model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production')
      logger.error('Error while syncing Chat')
  })

module.exports = Chat
