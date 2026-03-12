const logger = (message, error = null) => {
  const date = new Date().toISOString()
  const logType = error ? 'ERROR' : 'INFO'

  console[logType.toLowerCase()](
    `[${logType}] ${date} - ${message}`,
    error ? error : null
  )
}

module.exports = logger
