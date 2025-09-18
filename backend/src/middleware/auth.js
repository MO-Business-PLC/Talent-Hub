import { verifyToken, extractTokenFromHeader } from "../utils/jwt.js";

// Verify JWT and attach decoded user to req.user
export const auth = (req, res, next) => {
  try {
    const token = extractTokenFromHeader(req.headers?.authorization);

    if (!token) {
      return res.status(401).json({ error: "Authorization token missing" });
    }

    const decoded = verifyToken(token);

    req.user = decoded;
  
    return next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    console.error("Stack trace:", error.stack);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

 
export const authorize = (...allowedRoles) => {
  return (req, res, next) => { 

    if (!req.user) { 
      return res.status(401).json({ error: "Not authenticated" });
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ error: "Forbidden: insufficient permissions" });
    }
 
    return next();
  };
};

