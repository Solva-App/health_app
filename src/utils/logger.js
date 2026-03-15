const { getWAT } = require('./time')

const logger = {
  info: (msg) => console.log(`[INFO ${getWAT()}] ${msg}`),

  error: (msg, trace = '') => {
    const errorLog = trace ? `${msg} | Details: ${trace}` : msg
    console.error(`[ERROR ${getWAT()}] ${errorLog}`)
  },

  warn: (msg) => console.warn(`[WARN ${getWAT()}] ${msg}`),

  stream: {
    write: (message) => console.log(`[HTTP ${getWAT()}] ${message.trim()}`),
  },
}

module.exports = logger
