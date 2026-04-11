const jwt = require("jsonwebtoken");

/**
 * ✅ Verify JWT Middleware
 * Expects: Authorization: Bearer <token>
 * Attaches: req.user = { userId, role, email }
 */
const verifyJwtToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized: Authorization header missing" });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token must be Bearer <token>" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded contains: { userId, role, email, iat, exp }
    req.user = {
      userId: decoded.userId,
      role: decoded.role,
      email: decoded.email,
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

module.exports = verifyJwtToken;