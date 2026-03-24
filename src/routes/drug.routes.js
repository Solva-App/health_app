const express = require('express')
const router = express.Router()
const validate = require('../middlewares/validate')
const auth = require('../middlewares/auth')
const isVerified = require('../middlewares/verify')
const drugController = require('../controllers/drug.controller')
const schemas = require('../utils/schemas')

router.use(auth)
router.use(isVerified)

router.get('/categories', drugController.getDrugCategories)
router.get('/categories/:categoryId/details', drugController.getDrugCategory)
router.get('/categories/:categoryId', drugController.getDrugsByCategory)
router.post('/categories', validate(schemas.createDrugCategory), drugController.createDrugCategory)
router.patch('/categories/:id', validate(schemas.updateDrugCategory), drugController.updateDrugCategory)
router.delete('/categories/:id', drugController.deleteDrugCategory)

router.get('/search', drugController.getDrugsByKeyword)

router.get('/', drugController.getDrugs)
router.get('/:id', drugController.getDrugById)
router.post('/', validate(schemas.createDrug), drugController.createDrug)
router.patch('/:id', validate(schemas.updateDrug), drugController.updateDrug)
router.delete('/:id', drugController.deleteDrug)

module.exports = router
