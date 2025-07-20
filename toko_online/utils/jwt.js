const jwt = require("jsonwebtoken");

const generateToken = (payload, secretKey, expiresIn = "1h") => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

const verifyToken = (token, secretKey) => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
