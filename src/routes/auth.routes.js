const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const schemas = require('../utils/schemas')
const authController = require('../controllers/auth.controller')

router.post('/register', validate(schemas.register), authController.register)
router.post('/login', validate(schemas.login), authController.login)
router.post('/refresh-token', authController.refreshToken)
router.post('/logout', auth, authController.logout)

module.exports = router
