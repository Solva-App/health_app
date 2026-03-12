require("dotenv").config();
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')

// const userRoutes = require('./routes/user.routes')

const app = express()

app.use(cors())
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

app.get('/api/ping', (req, res) => {
  res.status(200).json({ message: 'Server is running' })
})

// app.use('/api/users', userRoutes)

module.exports = app