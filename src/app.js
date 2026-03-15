/* eslint-disable no-unused-vars */
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const morgan = require('./middlewares/logger')
const handleError = require('./middlewares/error')
const { limiter } = require('./middlewares/rateLimiter')

const logger = require('./utils/logger')
const { notFound } = require('./utils/response')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan)
app.use(limiter)

app.get('/api/v1/ping', (req, res) => {
  res.status(200).json({ success: true, message: 'Server is running' })
})

app.use((req, res, next) => {
  return notFound(
    res,
    `Resources not found for ${req.method} ${req.originalUrl}`
  )
})

app.use(handleError)

module.exports = app
