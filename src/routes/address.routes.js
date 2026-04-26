const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const isVerified = require('../middlewares/verify')
const addressController = require('../controllers/address.controller')
const schemas = require('../utils/schemas')

router.use(auth)
router.use(isVerified)

router.get('/', addressController.getUserAddresses)
router.post('/', validate(schemas.createAddressSchema), addressController.createAddress)
router.delete('/:id', addressController.deleteAddress)

module.exports = router
