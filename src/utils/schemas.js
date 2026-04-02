const Joi = require('joi')

const schemas = {
  register: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,30}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password cannot exceed 30 characters.',
        'any.required': 'Password is required.',
      }),
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),

  verifyCode: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
  }),

  refreshToken: Joi.object({
    token: Joi.string().required(),
  }),

  resendOtp: Joi.object({
    email: Joi.string().email().required(),
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required(),
  }),

  resetPassword: Joi.object({
    email: Joi.string().email().required(),
    code: Joi.number().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,30}$'))
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password cannot exceed 30 characters.',
        'any.required': 'Password is required.',
      }),
  }),

  updateUser: Joi.object({
    userName: Joi.string().min(3).max(50).optional(),
    fullName: Joi.string().optional(),
    phoneNumber: Joi.string()
      .regex(/^(?:\+234|234|0)[789][01]\d{8}$/)
      .optional()
      .messages({
        'string.pattern.base': 'Please provide a valid Nigerian phone number (e.g., 080... or +234...)',
      })
      .custom((value) => {
        // Normalize to 080... format
        if (value.startsWith('+234')) {
          return '0' + value.slice(4)
        }
        if (value.startsWith('234')) {
          return '0' + value.slice(3)
        }
        return value
      }),
  }),

  changePassword: Joi.object({
    currentPassword: Joi.string(),
    newPassword: Joi.string()
      .min(8)
      .max(30)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,30}$'))
      .required()
      .messages({
        'string.pattern.base':
          'New Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'New Password must be at least 8 characters long.',
        'string.max': 'New Password cannot exceed 30 characters.',
        'any.required': 'New Password is required.',
      }),
  }),

  createDrug: Joi.object({
    name: Joi.string().required(),
    brandName: Joi.string(),
    categoryId: Joi.string().guid().required(),
    imageUrl: Joi.string().optional(),
    type: Joi.string().optional(),
    dosage: Joi.string().optional(),
    price: Joi.number().precision(2).required(),
  }),

  updateDrug: Joi.object({
    name: Joi.string(),
    brandName: Joi.string(),
    categoryId: Joi.string().guid(),
    imageUrl: Joi.string().optional(),
    type: Joi.string().optional(),
    dosage: Joi.string().optional(),
    price: Joi.number().precision(2),
  }),

  createDrugCategory: Joi.object({
    name: Joi.string().required(),
    description: Joi.string(),
  }),

  updateDrugCategory: Joi.object({
    name: Joi.string(),
    description: Joi.string(),
  }),

  createPrescription: Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Please provide a title for this prescription',
    }),
    items: Joi.array()
      .items(
        Joi.object({
          drugId: Joi.string().uuid().required(),
          instructions: Joi.string().required(),
          duration: Joi.string().allow('', null),
        })
      )
      .min(1)
      .required()
      .messages({
        'array.min': 'A prescription must have at least one medication',
      }),
  }),
}

module.exports = schemas
