const Joi = require('joi')

const schemas = {
  register: Joi.object({
    fullName: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(30)
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,30}$'
        )
      )
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
      .pattern(
        new RegExp(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+=-]).{8,30}$'
        )
      )
      .required()
      .messages({
        'string.pattern.base':
          'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
        'string.min': 'Password must be at least 8 characters long.',
        'string.max': 'Password cannot exceed 30 characters.',
        'any.required': 'Password is required.',
      }),
  }),
}

module.exports = schemas
