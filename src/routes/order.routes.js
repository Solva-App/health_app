const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const isVerified = require('../middlewares/verify')
const orderController = require('../controllers/order.controller')
const schemas = require('../utils/schemas')

router.use(auth)
router.use(isVerified)

router.post('/', validate(schemas.createOrderSchema), orderController.createOrder)
router.get('/', orderController.getUserOrders)
router.get('/:id', orderController.getOrderById)
router.get('/:id/verify', validate(schemas.verifyPayment),orderController.verifyOrderPayment)
router.post('/:id/pay', orderController.payForOrder)

module.exports = router
