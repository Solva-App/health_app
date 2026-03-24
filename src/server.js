require('dotenv').config()
const app = require('./app')
const { connectDB } = require('./config/db')
const logger = require('./utils/logger')
const setupAssociations = require('./models/associations')

const PORT = process.env.PORT || 3000

async function startServer() {
  try {
    await connectDB()
    await setupAssociations()
    app.listen(PORT, () => {
      logger.info(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    logger.error('Failed to start the server:', error)
    process.exit(1)
  }
}

startServer()
