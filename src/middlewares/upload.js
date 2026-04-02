const multer = require('multer')
const { badRequest } = require('../utils/response')

const storageConfigs = {
  memory: multer.memoryStorage(),
  disk: multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    },
  }),
}

const uploadMiddleware = (type = 'memory', fieldName = 'file') => {
  const upload = multer({
    storage: storageConfigs[type],
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      const allowed = /jpeg|jpg|png|pdf/
      const isValid = allowed.test(file.mimetype)
      if (isValid) return cb(null, true)
      cb(new Error('Invalid file type. Only JPG, PNG, and PDF are allowed.'))
    },
  }).single(fieldName)

  return (req, res, next) => {
    upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        return badRequest(res, `Upload Error: ${err.message}`)
      } else if (err) {
        return badRequest(res, err.message)
      }
      next()
    })
  }
}

module.exports = uploadMiddleware
