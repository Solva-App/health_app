const app = require('./app')
const { connectDB } = require('./config/db')

async function startServer() {
  await connectDB()

  app.listen(process.env.PORT, () => {
    console.log(`[SERVER] Running on port ${process.env.PORT}`)
  })
}

startServer()
