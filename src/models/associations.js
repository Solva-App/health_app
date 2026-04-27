const User = require('./user.model')
const Otp = require('./otp.model')
const { Drug, DrugCategory } = require('./drug.model')
const { Prescription, PrescriptionItem } = require('./prescription.model')
const { Order, OrderItem, OrderHistory } = require('./order.model')
const Address = require('./address.model')
const Chat = require('./chat.model')

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

  User.hasMany(Order, { foreignKey: 'userId', as: 'orders' })
  Order.belongsTo(User, { foreignKey: 'userId', as: 'customer' })

  Order.hasMany(OrderItem, { as: 'items', foreignKey: 'orderId' })
  OrderItem.belongsTo(Order, { foreignKey: 'orderId' })

  Order.hasMany(OrderHistory, { as: 'history', foreignKey: 'orderId' })
  OrderHistory.belongsTo(Order, { foreignKey: 'orderId' })

  Drug.hasMany(OrderItem, { foreignKey: 'drugId' })
  OrderItem.belongsTo(Drug, { as: 'drug', foreignKey: 'drugId' })

  User.hasMany(Address, { foreignKey: 'userId', as: 'addresses' })
  Address.belongsTo(User, { foreignKey: 'userId' })

  Order.belongsTo(Address, { foreignKey: 'addressId', as: 'shippingDetails' })

  User.hasMany(Chat, { foreignKey: 'userId', as: 'chats' })
  Chat.belongsTo(User, { foreignKey: 'userId', as: 'user' })
}

module.exports = setupAssociations
