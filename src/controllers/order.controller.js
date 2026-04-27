const { sequelize } = require('../config/db')
const { Order, OrderItem, OrderHistory } = require('../models/order.model')
const { Drug } = require('../models/drug.model')
const Address = require('../models/address.model')
const { success, created, notFound, badRequest } = require('../utils/response')
const { initializePayment, verifyPayment } = require('../utils/paystack')

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
        status: 'pending',
        totalAmount,
        addressId: finalAddressId,
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

const payForOrder = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;

    const order = await Order.findByPk(id);
    if (!order) {
      return notFound(res, 'Order not found')
    }

    if (order.status !== 'pending') {
      return badRequest(res, `Order cannot be paid for because it is ${order.status}`)
    }

    const callback = req.query.callback

    const paymentData = await initializePayment({
      amount: order.totalAmount * 100,
      email: req.user.email,
      callback_url: callback ? callback.toLowerCase().trim() : undefined,
      metadata: JSON.stringify({
        id: req.user.id,
        orderId: order.id,
      }),
    })

    await order.update({
      paymentReference: paymentData.data.reference
    }, { transaction: t });

    await OrderHistory.create({
      orderId: order.id,
      status: 'pending',
    }, { transaction: t });

    await t.commit();

    return success(res, 'Payment link generated', paymentData);
  } catch (err) {
    await t.rollback();
    next(err);
  }
}

const verifyOrderPayment = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { reference } = req.body;

    const response = await verifyPayment(reference);

    const paymentData = response?.data;

    if (!paymentData || paymentData.status !== 'success') {
      await t.rollback();
      return badRequest(res, 'Payment verification failed or was not successful');
    }

    const orderId = paymentData.metadata?.orderId;

    if (!orderId) {
      await t.rollback();
      return badRequest(res, 'Order ID missing from payment metadata');
    }

    if (req.params.id !== orderId) {
      await t.rollback();
      return badRequest(res, 'Order ID mismatch between request and payment metadata');
    }

    const order = await Order.findByPk(orderId);

    if (!order) {
      await t.rollback();
      return notFound(res, 'Order not found');
    }

    if (order.status !== 'pending') {
      await t.rollback();
      return success(res, 'Order already processed');
    }

    await order.update({
      status: 'processing',
      paymentReference: reference
    }, { transaction: t });

    await OrderHistory.create({
      orderId: order.id,
      status: 'processing',
    }, { transaction: t });

    await t.commit();
    return success(res, 'Payment verified and order is now processing');

  } catch (err) {
    if (t) await t.rollback();
    console.error(`[Verification Error]: ${err.message}`);
    next(err);
  }
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  payForOrder,
  verifyOrderPayment
}
