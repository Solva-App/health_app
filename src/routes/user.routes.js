const express = require('express')
const { getUser } = require('../controllers/user.controller')

const router = express.Router()

router.get('/', getUsers)

module.exports = router