const User = require('./user.model')
const Otp = require('./otp.model')

const setupAssociations = () => {
  User.hasOne(Otp, { foreignKey: 'userId', as: 'otp', onDelete: 'CASCADE' })
  Otp.belongsTo(User, { foreignKey: 'userId', as: 'user' })
}

module.exports = setupAssociations
