const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const schemas = require('../utils/schemas')
const isVerified = require('../middlewares/verify')
const auth = require('../middlewares/auth')
const chatController = require('../controllers/chat.controller')

router.use(auth)
router.use(isVerified)

router.post('/ask', validate(schemas.sendMessage), chatController.sendMessage)
router.get('/history/', chatController.getChatHistory)

module.exports = router
