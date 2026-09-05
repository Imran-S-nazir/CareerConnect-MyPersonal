const jwt = require("jsonwebtoken");
const User = require("../models/User.js");

/**
 * Authentication Middleware with Redis Session Support & Auto Idle Timeout
 * 
 * 1. Checks Redis Session (`req.session.user`).
 * 2. On activity, updates in-session `lastActive` timestamp (rolling: true extends TTL).
 * 3. Falls back to Bearer / Cookie JWT if token is provided.
 * 4. Returns 401 with `SESSION_EXPIRED` code when session has timed out.
 */
const protect = async (req, res, next) => {
  try {
    // 1. Primary Authentication: Active Redis Session
    if (req.session && req.session.user && req.session.user.userId) {
      const user = await User.findById(req.session.user.userId).select("-password");

      if (!user) {
        // User deleted or invalid in MongoDB -> destroy stale session
        req.session.destroy(() => {});
        return res.status(401).json({
          success: false,
          code: "SESSION_INVALID",
          message: "User account no longer exists",
        });
      }

      // Update session activity time
      req.session.user.lastActive = new Date();

      // Attach user & session details to request
      req.user = user;
      req.sessionUser = req.session.user;
      return next();
    }

    // 2. Secondary / Fallback Authentication: JWT Token (Cookie or Header)
    let token = req.cookies?.token;
    if (!token && req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        code: "SESSION_EXPIRED",
        message: "Your session has expired due to inactivity. Please log in again.",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        code: "USER_NOT_FOUND",
        message: "User not found",
      });
    }

    req.user = user;

    // Automatically seed Redis session if not yet active
    if (req.session && !req.session.user) {
      req.session.user = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        userType: user.userType,
        loginTime: new Date(),
        lastActive: new Date(),
      };
    }

    return next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      code: "SESSION_EXPIRED",
      message: "Invalid or expired session. Please log in again.",
    });
  }
};

module.exports = protect;