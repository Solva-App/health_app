const morgan = require('morgan')
const logger = require('../utils/logger')

const format = ':method :url :status :res[content-length] - :response-time ms'
module.exports = morgan(format, { stream: logger.stream })
