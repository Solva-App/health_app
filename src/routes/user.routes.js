const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const isVerified = require('../middlewares/verify')
const auth = require('../middlewares/auth')
const schemas = require('../utils/schemas')
const userController = require('../controllers/user.controller')

router.use(auth)
router.use(isVerified)
router.get('/', userController.getUser)
router.patch('/update', validate(schemas.updateUser), userController.updateUser)
router.put('/change-password', validate(schemas.changePassword), userController.changePassword)
router.delete('/delete', userController.deleteAccount)

module.exports = router
