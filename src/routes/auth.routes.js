const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const schemas = require('../utils/schemas')
const authController = require('../controllers/auth.controller')

router.post('/register', validate(schemas.register), authController.register)
router.post('/login', validate(schemas.login), authController.login)
router.post('/verify-code', validate(schemas.verifyCode), authController.verifyCode)
router.post('/resend-otp', validate(schemas.resendOtp), authController.resendOtp)
router.post('/forgot-password', validate(schemas.forgotPassword), authController.forgotPassword)
router.post('/reset-password', validate(schemas.resetPassword), authController.resetPassword)
router.post('/refresh-token', validate(schemas.refreshToken), authController.refreshToken)

module.exports = router
