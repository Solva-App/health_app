const OpenAI = require('openai')

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const aiConfig = {
  model: process.env.OPENAI_MODEL_NAME,
  temperature: 0.7,
}

module.exports = {
  openai,
  aiConfig,
}
