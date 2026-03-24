const { Op } = require('sequelize')
const { Drug, DrugCategory } = require('../models/drug.model')
const { success, notFound, created } = require('../utils/response')

const getDrugs = async (req, res, next) => {
  try {
    const drugs = await Drug.findAll({
      attributes: ['id', 'name', 'brandName', 'categoryId', 'imageUrl', 'type', 'dosage', 'price'],
      include: [
        {
          model: DrugCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return success(res, 'Drugs retrieved successfully', drugs)
  } catch (error) {
    next(error)
  }
}

const getDrugById = async (req, res, next) => {
  try {
    const { id } = req.params
    const drug = await Drug.findByPk(id, {
      attributes: ['id', 'name', 'brandName', 'categoryId', 'imageUrl', 'type', 'dosage', 'price'],
      include: [
        {
          model: DrugCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    if (!drug) {
      return notFound(res, `Drug not found`)
    }

    return success(res, 'Drug retrieved successfully', drug)
  } catch (error) {
    next(error)
  }
}

const getDrugsByKeyword = async (req, res, next) => {
  try {
    const { keyword } = req.query

    if (!keyword) {
      return success(res, 'Please provide a search keyword', [])
    }

    const drugs = await Drug.findAll({
      where: {
        [Op.or]: [{ name: { [Op.like]: `%${keyword}%` } }, { brandName: { [Op.like]: `%${keyword}%` } }],
      },
      attributes: ['id', 'name', 'brandName', 'categoryId', 'imageUrl', 'type', 'dosage', 'price'],
      include: [
        {
          model: DrugCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return success(res, 'Drugs retrieved successfully', drugs)
  } catch (error) {
    next(error)
  }
}

const getDrugCategories = async (req, res, next) => {
  try {
    const categories = await DrugCategory.findAll({
      attributes: ['id', 'name'],
    })

    return success(res, 'Drug categories retrieved successfully', categories)
  } catch (error) {
    next(error)
  }
}

const getDrugsByCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const drugs = await Drug.findAll({
      where: { categoryId },
      attributes: ['id', 'name', 'brandName', 'categoryId', 'imageUrl', 'type', 'dosage', 'price'],
      include: [
        {
          model: DrugCategory,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    })

    return success(res, 'Drugs retrieved successfully', drugs)
  } catch (error) {
    next(error)
  }
}

const getDrugCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params
    const category = await DrugCategory.findByPk(categoryId, {
      attributes: ['id', 'name'],
    })

    if (!category) {
      return notFound(res, `Drug Category not found`)
    }

    return success(res, 'Drug category retrieved successfully', category)
  } catch (error) {
    next(error)
  }
}

const createDrug = async (req, res, next) => {
  try {
    const { name, brandName, categoryId, imageUrl, type, dosage, price } = req.body
    const drug = await Drug.create({
      name,
      brandName,
      categoryId,
      imageUrl,
      type,
      dosage,
      price,
    })

    return created(res, 'Drug created successfully', drug)
  } catch (error) {
    next(error)
  }
}

const updateDrug = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, brandName, categoryId, imageUrl, type, dosage, price } = req.body
    const drug = await Drug.findByPk(id)

    if (!drug) {
      return notFound(res, `Drug not found`)
    }

    await drug.update({
      name,
      brandName,
      categoryId,
      imageUrl,
      type,
      dosage,
      price,
    })

    return success(res, 'Drug updated successfully', drug)
  } catch (error) {
    next(error)
  }
}

const deleteDrug = async (req, res, next) => {
  try {
    const { id } = req.params
    const drug = await Drug.findByPk(id)

    if (!drug) {
      return notFound(res, `Drug not found`)
    }

    await drug.destroy()

    return success(res, 'Drug deleted successfully')
  } catch (error) {
    next(error)
  }
}

const createDrugCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body
    const category = await DrugCategory.create({
      name,
      description,
    })

    return created(res, 'Drug Category created successfully', category)
  } catch (error) {
    next(error)
  }
}

const updateDrugCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const { name, description } = req.body
    const category = await DrugCategory.findByPk(id)

    if (!category) {
      return notFound(res, `Drug Category not found`)
    }

    await category.update({
      name,
      description,
    })

    return success(res, 'Drug Category updated successfully', category)
  } catch (error) {
    next(error)
  }
}

const deleteDrugCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await DrugCategory.findByPk(id)

    if (!category) {
      return notFound(res, `Drug Category not found`)
    }

    await category.destroy()

    return success(res, 'Drug Category deleted successfully')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getDrugs,
  getDrugById,
  getDrugsByKeyword,
  getDrugCategories,
  getDrugsByCategory,
  getDrugCategory,
  createDrug,
  updateDrug,
  deleteDrug,
  createDrugCategory,
  updateDrugCategory,
  deleteDrugCategory,
}
