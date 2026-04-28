const axios = require('axios')
const { headers } = require('../config/paystack')
const { serverError } = require('../utils/response')

const baseurl = process.env.PAYSTACK_BASEURL

const initializePayment = async (body) => {
  try {
    const request = {
      url: `${baseurl}/transaction/initialize`,
      method: 'POST',
      headers: {
        ...headers,
      },
      data: body,
    }
    const response = await axios(request)
    return response.data
  } catch (error) {
    if (error.request && !error.response) return serverError('Error connecting to server!')
    return serverError(
      error?.response?.data?.message,
      error.message || error.response.message || error.response.data || 'something went wrong!'
    )
  }
}

const verifyPayment = async (reference) => {
  try {
    const request = {
      url: `${baseurl}/transaction/verify/${reference}`,
      method: 'GET',
      headers: {
        ...headers,
      },
    }
    const response = await axios(request)
    return response.data
  } catch (error) {
    return error
  }
}

module.exports = {
  initializePayment,
  verifyPayment,
}
