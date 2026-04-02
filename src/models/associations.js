const User = require('./user.model')
const Otp = require('./otp.model')
const { Drug, DrugCategory } = require('./drug.model')
const { Prescription, PrescriptionItem } = require('./prescription.model')

const setupAssociations = () => {
  User.hasOne(Otp, { foreignKey: 'userId', as: 'otp', onDelete: 'CASCADE' })
  Otp.belongsTo(User, { foreignKey: 'userId', as: 'user' })

  DrugCategory.hasMany(Drug, { foreignKey: 'categoryId', as: 'drugs' })
  Drug.belongsTo(DrugCategory, { foreignKey: 'categoryId', as: 'category' })

  Drug.hasMany(PrescriptionItem, {
    foreignKey: 'drugId',
    as: 'prescriptionUsages',
  })
  PrescriptionItem.belongsTo(Drug, {
    foreignKey: 'drugId',
    as: 'drugDetails',
  })

  User.hasMany(Prescription, {
    foreignKey: 'userId',
    as: 'prescriptions',
    onDelete: 'CASCADE',
  })
  Prescription.belongsTo(User, {
    foreignKey: 'userId',
    as: 'patient',
  })

  Prescription.hasMany(PrescriptionItem, {
    foreignKey: 'prescriptionId',
    as: 'items',
    onDelete: 'CASCADE',
  })
  PrescriptionItem.belongsTo(Prescription, {
    foreignKey: 'prescriptionId',
    as: 'header',
  })
}

module.exports = setupAssociations
