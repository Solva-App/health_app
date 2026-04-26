const { bucket } = require('../config/firebase')

const { serverError, success } = require('./response')

const fileUpload = async function (file, location) {
  try {
    if (!file || !file.buffer) {
      return serverError('No file buffer found. Ensure Multer is using memoryStorage.')
    }

    const fileName = `${location}/${Math.round(Math.random() * 1e9)}-${file.originalname.trim().replace(/\s+/g, '_')}`
    const fileRef = bucket.file(fileName)

    await fileRef.save(file.buffer, {
      metadata: { contentType: file.mimetype },
      public: true,
    })

    return success(`https://storage.googleapis.com/${bucket.name}/${fileName}`)
  } catch (error) {
    return serverError(error, 'Something went wrong during file upload')
  }
}

module.exports = { fileUpload }
