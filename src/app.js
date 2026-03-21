const express = require('express')
const cors = require('cors')
const helmet = require('helmet')

const morgan = require('./middlewares/logger')
const handleError = require('./middlewares/error')
const { limiter } = require('./middlewares/rateLimiter')

const logger = require('./utils/logger')
const { notFound, success } = require('./utils/response')

const authRoutes = require('./routes/auth.routes')

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())
app.use(morgan)
app.use(limiter)

app.get('/api/v1/ping', (req, res) => {
  logger.info('Server pinged')
  return success(res, 'Server is running')
})

app.use('/api/v1/auth', authRoutes)

app.use((req, res) => {
  logger.error(`Resources not found for ${req.method} ${req.originalUrl}`)
  return notFound(
    res,
    `Resources not found for ${req.method} ${req.originalUrl}`
  )
})

app.use(handleError)

module.exports = app
