const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const isVerified = require('../middlewares/verify')
const upload = require('../middlewares/upload')
const prescriptionController = require('../controllers/prescription.controller')
const schemas = require('../utils/schemas')

router.use(auth)
router.use(isVerified)

router.get('/', prescriptionController.getUserPrescriptions)
router.post('/', validate(schemas.createPrescription), prescriptionController.createPrescription)
router.post('/scan', upload('memory', 'prescription'), prescriptionController.scanPrescription)
router.get('/:id', prescriptionController.getPrescriptionById)
router.patch('/:id', validate(schemas.updatePrescription), prescriptionController.updatePrescription)
router.delete('/:id', prescriptionController.deletePrescription)

module.exports = router
