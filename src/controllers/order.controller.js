const { sequelize } = require('../config/db')
const { Order, OrderItem, OrderHistory } = require('../models/order.model')
const { Drug } = require('../models/drug.model')
const Address = require('../models/address.model')
const { success, created, notFound } = require('../utils/response')

const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { items, addressId, street, city, state } = req.body
    let finalAddressId = addressId

    if (!finalAddressId) {
      const [address] = await Address.findOrCreate({
        where: { userId: req.user.id, street, city, state },
        defaults: { userId: req.user.id, street, city, state },
        transaction: t,
      })
      finalAddressId = address.id
    }

    let totalAmount = 0
    for (const item of items) {
      const drug = await Drug.findByPk(item.drugId)
      if (!drug) throw new Error(`Drug ${item.drugId} not found`)
      totalAmount += parseFloat(drug.price) * item.quantity
    }

    const order = await Order.create(
      {
        userId: req.user.id,
        totalAmount,
        addressId: finalAddressId,
        status: 'pending',
      },
      { transaction: t }
    )

    const itemsWithOrderId = items.map((i) => ({ ...i, orderId: order.id }))
    await OrderItem.bulkCreate(itemsWithOrderId, { transaction: t })

    await t.commit()
    return created(res, 'Order placed successfully', order)
  } catch (err) {
    await t.rollback()
    next(err)
  }
}

const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: OrderItem, as: 'items', include: ['drug'] }],
      order: [['createdAt', 'DESC']],
    })
    return success(res, 'Orders retrieved', orders)
  } catch (err) {
    next(err)
  }
}

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.user.id },
      include: [
        { model: OrderItem, as: 'items', include: ['drug'] },
        { model: OrderHistory, as: 'history' },
      ],
    })
    if (!order) return notFound(res, 'Order not found')
    return success(res, 'Order details retrieved', order)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
}
