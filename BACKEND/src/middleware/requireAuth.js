const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization; // "Bearer <token>"
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: token missing" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Put user info on req.user (match what your code expects)
    req.user = { id: decoded.id || decoded._id || decoded.userId };

    if (!req.user.id) {
      return res.status(401).json({ message: "Unauthorized: invalid token payload" });
    }

    next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized: invalid/expired token" });
  }
};

module.exports = { requireAuth };