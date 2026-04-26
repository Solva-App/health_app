const Chat = require('../models/chat.model')
const { openai, aiConfig } = require('../config/openai')
const { success } = require('../utils/response')

const MEDICAL_DISCLAIMER =
  '\n\n**Disclaimer:** I am an AI, not a doctor. This information is for educational purposes and may be incorrect. Please consult a healthcare professional for medical advice.'

const sendMessage = async (req, res, next) => {
  try {
    const { message } = req.body
    const userId = req.user.id

    await Chat.create({ userId, role: 'user', content: message })

    const completion = await openai.chat.completions.create({
      model: aiConfig.model,
      messages: [
        { role: 'system', content: 'You are a helpful health assistant. Provide concise info but always be cautious.' },
        { role: 'user', content: message },
      ],
    })

    const aiText = completion.choices[0].message.content + MEDICAL_DISCLAIMER

    const savedAiMessage = await Chat.create({
      userId,
      role: 'assistant',
      content: aiText,
    })

    return success(res, 'Message generated', savedAiMessage)
  } catch (err) {
    next(err)
  }
}

const getChatHistory = async (req, res, next) => {
  try {
    const userId = req.user.id
    const history = await Chat.findAll({
      where: { userId },
      order: [['createdAt', 'ASC']],
    })
    return success(res, 'Chat History Gotten', history)
  } catch (err) {
    next(err)
  }
}

module.exports = {
  sendMessage,
  getChatHistory,
}
