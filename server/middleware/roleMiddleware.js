/**
 * Role and UserType Authorization Middlewares
 */

// Verify that the authenticated user matches one of the allowed user types (e.g. 'student', 'fresher', 'professional')
const requireUserType = (...allowedTypes) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedTypes.includes(req.user.userType)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires user type: ${allowedTypes.join(" or ")}. Your account is registered as '${req.user.userType}'.`,
      });
    }

    next();
  };
};

// Verify that the authenticated user matches one of the allowed account roles (e.g. 'user', 'admin', 'employer')
const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Requires role: ${allowedRoles.join(" or ")}`,
      });
    }

    next();
  };
};

module.exports = {
  requireUserType,
  requireRole,
};
