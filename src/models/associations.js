const User = require('./user.model')
const Otp = require('./otp.model')
const { Drug, DrugCategory } = require('./drug.model')
const { Prescription, PrescriptionItem } = require('./prescription.model')

const setupAssociations = () => {
  User.hasOne(Otp, { foreignKey: 'userId', as: 'otp', onDelete: 'CASCADE' })
  Otp.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  DrugCategory.hasMany(Drug, { foreignKey: 'categoryId', as: 'drugs' })
  Drug.belongsTo(DrugCategory, { foreignKey: 'categoryId', as: 'category' })

  Prescription.belongsToMany(Drug, {
    through: PrescriptionItem,
    as: 'medications',
  })
  Drug.belongsToMany(Prescription, {
    through: PrescriptionItem,
  })

  Prescription.belongsTo(User, { foreignKey: 'userId', as: 'patient' })
  User.hasMany(Prescription, { foreignKey: 'userId', as: 'prescriptions' })
}

module.exports = setupAssociations
