const { verifyToken } = require("../utils/jwt");
function authorization(req, res, next) {
  const token = req.headers.authorization;
  if (!token) {
    return res
      .status(403)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = verifyToken(token.split(" ")[1], process.env.JWT_SECRET);
    console.log("Decoded token:", decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Authorization error:", err);
    res.status(401).json({ message: "Invalid token." });
  }
}

module.exports = authorization;
