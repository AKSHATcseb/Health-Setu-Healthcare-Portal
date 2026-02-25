const admin = require("../config/firebase");

/**
 * ✅ Verify Firebase ID Token Middleware
 */
const verifyFirebaseToken = async (req, res, next) => {
  try {
    // 1️⃣ Check Authorization Header
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        message: "Unauthorized: Authorization header missing",
      });
    }

    // 2️⃣ Must start with Bearer
    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized: Token must be Bearer <token>",
      });
    }

    // 3️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized: Token missing",
      });
    }

    // 4️⃣ Verify token with Firebase Admin SDK
    const decodedToken = await admin.auth().verifyIdToken(token);

    // 5️⃣ Attach user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || null,
      phone: decodedToken.phone_number || null,
      email_verified: decodedToken.email_verified || false,
    };

    next();
  } catch (error) {
    console.error("Firebase Auth Error:", error.message);

    // Token expired case
    if (error.code === "auth/id-token-expired") {
      return res.status(401).json({
        message: "Session expired. Please login again.",
      });
    }

    return res.status(401).json({
      message: "Unauthorized: Invalid Firebase token",
    });
  }
};

module.exports = verifyFirebaseToken;
