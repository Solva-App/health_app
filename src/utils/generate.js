const generateOtpData = (minutes = 10) => {
  const code = Math.floor(100000 + Math.random() * 900000);

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + minutes);

  return { code, expiresAt };
};

module.exports = { generateOtpData };