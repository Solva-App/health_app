const { createWorker } = require('tesseract.js');
const logger = require('./logger');

const performOCR = async (imageBuffer) => {
  const worker = await createWorker('eng');

  try {
    const { data: { text, confidence } } = await worker.recognize(imageBuffer);
    const cleanText = text
      .replace(/[\n\r]+/g, '\n')
      .trim();

    return {
      text: cleanText,
      confidence: confidence
    };
  } catch (error) {
    logger.error('Tesseract Utility Error:', error);
    return error;
  } finally {
    await worker.terminate();
  }
};

module.exports = performOCR;