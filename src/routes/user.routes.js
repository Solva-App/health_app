const express = require('express')
const router = express.Router()
const auth = require('../middlewares/auth')
const { getUser } = require('../controllers/user.controller')

router.use(auth)
router.get('/', getUser)

module.exports = router
