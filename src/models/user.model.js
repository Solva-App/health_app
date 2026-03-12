const { DataTypes } = require("sequelize");
const { sequelize } = require("../database/db");
// const bcrypt = require("bcryptjs");
// const CustomError = require("../helpers/error");

const userSchema = {
  id: {
    type: DataTypes.UUID,
    primaryKey: true,
    unique: true
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
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
};

const User = sequelize.define('User', userSchema, {
  timestamps: true,
  hooks: {
    beforeValidate() { },
    beforeUpdate() { },
    afterFind() { },
  },
})

User.sync({ alter: true })
  .then(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') console.log('=> User model synced')
  })
  .catch(() => {
    if (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production') console.log('Error while syncing User')
  })

module.exports = User
