const { User } = require("../models");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/jwt");
class AuthController {
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Generate JWT token
      const token = generateToken(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        "1h"
      );

      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      console.log("Error during login:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}

module.exports = AuthController;
