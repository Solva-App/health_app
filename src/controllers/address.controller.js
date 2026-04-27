const Address = require('../models/address.model');
const { success, notFound } = require('../utils/response');
const { sequelize } = require('../config/db');

const getUserAddresses = async (req, res, next) => {
  try {
    const addresses = await Address.findAll({
      where: { userId: req.user.id },
      order: [['isDefault', 'DESC'], ['createdAt', 'DESC']]
    });
    return success(res, 'Addresses retrieved', addresses);
  } catch (error) {
    next(error);
  }
};

const createAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const userId = req.user.id;
    let { isDefault } = req.body;

    const addressCount = await Address.count({ where: { userId }, transaction: t });

    if (addressCount === 0) {
      isDefault = true;
    } else if (isDefault) {
      await Address.update(
        { isDefault: false },
        { where: { userId, isDefault: true }, transaction: t }
      );
    }

    const address = await Address.create(
      { ...req.body, userId, isDefault },
      { transaction: t }
    );

    await t.commit();
    return success(res, 'Address added', address);
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const makeDefaultAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const targetAddress = await Address.findOne({
      where: { id, userId },
      transaction: t
    });

    if (!targetAddress) {
      await t.rollback();
      return notFound(res, 'Address not found');
    }

    if (targetAddress.isDefault) {
      await t.rollback();
      return success(res, 'Address is already the default', targetAddress);
    }

    await Address.update(
      { isDefault: false },
      {
        where: { userId, isDefault: true },
        transaction: t
      }
    );

    await targetAddress.update(
      { isDefault: true },
      { transaction: t }
    );

    await t.commit();
    return success(res, 'Default address updated successfully', targetAddress);
  } catch (error) {
    if (t) await t.rollback();
    next(error);
  }
};

const deleteAddress = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const addressToDelete = await Address.findOne({ where: { id, userId } });

    if (!addressToDelete) {
      await t.rollback();
      return success(res, 'Address not found', {}, 404);
    }

    const wasDefault = addressToDelete.isDefault;

    await Address.destroy({ where: { id, userId }, transaction: t });

    if (wasDefault) {
      const newestAddress = await Address.findOne({
        where: { userId },
        order: [['createdAt', 'DESC']],
        transaction: t
      });

      if (newestAddress) {
        await newestAddress.update({ isDefault: true }, { transaction: t });
      }
    }

    await t.commit();
    return success(res, 'Address deleted');
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

module.exports = {
  getUserAddresses,
  createAddress,
  makeDefaultAddress,
  deleteAddress,
};