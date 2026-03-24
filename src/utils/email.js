const path = require('path')
const fs = require('fs/promises')
const handlebars = require('handlebars')
const resend = require('../config/email')
const logger = require('./logger')

const prepareTemplate = async (templateName, context) => {
  const templatePath = path.join(__dirname, '../templates', `${templateName}.hbs`)
  const content = await fs.readFile(templatePath, 'utf-8')
  const compiled = handlebars.compile(content)
  return compiled(context)
}

const sendMail = async ({ to, subject, template, context }) => {
  try {
    const html = await prepareTemplate(template, context)

    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM || 'Health App <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
    })

    if (error) throw error
    logger.info(`Email [${template}] sent to ${to}`)
    return data
  } catch (err) {
    logger.error(`Mail Error (${template}):`, err.message)
    return err
  }
}

const sendWelcomeEmail = async (user) => {
  return sendMail({
    to: user.email,
    subject: 'Welcome to the Health Community!',
    template: 'welcome',
    context: {
      fullName: user.fullName,
      email: user.email,
    },
  })
}

const sendOtpEmail = async (user, otpCode) => {
  return sendMail({
    to: user.email,
    subject: 'Your Verification Code',
    template: 'otp-verification',
    context: {
      fullName: user.fullName,
      otpCode: otpCode,
      expiryMinutes: 10,
    },
  })
}

const sendResetPasswordEmail = async (user, otpCode) => {
  return sendMail({
    to: user.email,
    subject: 'Reset Your Password',
    template: 'reset-password',
    context: {
      fullName: user.fullName,
      otpCode: otpCode,
      expiryMinutes: 15,
    },
  })
}

module.exports = {
  sendWelcomeEmail,
  sendOtpEmail,
  sendResetPasswordEmail,
}
