const Address = require('../models/address.model')
const { success } = require('../utils/response')

const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({ where: { userId: req.user.id } })
    return success(res, 'Addresses retrieved', addresses)
  } catch (error) {
    next(error)
  }
}

const createAddress = async (req, res, next) => {
  try {
    const address = await Address.create({ ...req.body, userId: req.user.id })
    return success(res, 'Address added', address)
  } catch (error) {
    next(error)
  }
}

const deleteAddress = async (req, res, next) => {
  try {
    await Address.destroy({ where: { id: req.params.id, userId: req.user.id } })
    return success(res, 'Address deleted')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getUserAddresses,
  createAddress,
  deleteAddress,
}
