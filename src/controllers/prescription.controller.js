const { sequelize } = require('../config/db')
const { Prescription, PrescriptionItem } = require('../models/prescription.model')
const { Drug } = require('../models/drug.model')
const { success, created, notFound, badRequest, validationError } = require('../utils/response')
const performOCR = require('../utils/scan')

const scanPrescription = async (req, res, next) => {
  try {
    if (!req.file) return badRequest(res, 'No file uploaded', 400)

    const imageBuffer = req.file.buffer
    const result = await performOCR(imageBuffer)

    if (!result.text || result.text.length < 3) {
      return validationError(res, 'The scan was successful, but no readable text was found. Ensure the image is clear.')
    }

    return success(res, 'Scan complete', { text: result.text })
  } catch (err) {
    next(err)
  }
}

const createPrescription = async (req, res, next) => {
  const t = await sequelize.transaction()
  try {
    const { title, items } = req.body

    const prescription = await Prescription.create(
      {
        title,
        userId: req.user.id,
      },
      { transaction: t }
    )

    const itemsWithId = items.map((item) => ({
      ...item,
      prescriptionId: prescription.id,
    }))

    await PrescriptionItem.bulkCreate(itemsWithId, { transaction: t })

    await t.commit()

    return created(res, 'Prescription created successfully', prescription)
  } catch (error) {
    await t.rollback()
    next(error)
  }
}

const getUserPrescriptions = async (req, res, next) => {
  try {
    const prescriptions = await Prescription.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']],
    })
    return success(res, 'Prescriptions retrieved', prescriptions)
  } catch (error) {
    next(error)
  }
}

const getPrescriptionById = async (req, res, next) => {
  try {
    const { id } = req.params
    const prescription = await Prescription.findOne({
      where: { id, userId: req.user.id },
      include: [
        {
          model: PrescriptionItem,
          as: 'items',
          include: [
            {
              model: Drug,
              as: 'drugDetails',
              attributes: ['name', 'brandName', 'imageUrl', 'price'],
            },
          ],
        },
      ],
    })

    if (!prescription) return notFound(res, 'Prescription not found')

    return success(res, 'Prescription details retrieved', prescription)
  } catch (error) {
    next(error)
  }
}

const updatePrescription = async (req, res, next) => {
  try {
    const { id } = req.params
    const { title, items } = req.body

    const prescription = await Prescription.findOne({
      where: { id, userId: req.user.id },
    })

    if (!prescription) return notFound(res, 'Prescription not found')

    await prescription.update({ title })

    const itemsWithId = items.map((item) => ({
      ...item,
      prescriptionId: prescription.id,
    }))

    await PrescriptionItem.bulkCreate(itemsWithId, {
      ignoreDuplicates: true,
    })

    return success(res, 'Prescription updated successfully', prescription)
  } catch (error) {
    next(error)
  }
}

const deletePrescription = async (req, res, next) => {
  try {
    const { id } = req.params
    const deleted = await Prescription.destroy({
      where: { id, userId: req.user.id },
    })

    if (!deleted) return notFound(res, 'Prescription not found')

    return success(res, 'Prescription deleted successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  scanPrescription,
  createPrescription,
  getUserPrescriptions,
  getPrescriptionById,
  updatePrescription,
  deletePrescription,
}
