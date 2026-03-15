const getWAT = () => {
  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'Africa/Lagos',
  }).format(new Date())
}

module.exports = { getWAT }
