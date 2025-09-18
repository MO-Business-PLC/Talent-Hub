import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt_key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

/**
 * Generate JWT token
 * @param {Object} payload - The payload to encode
 * @param {string} expiresIn - Token expiration time
 * @returns {string} JWT token
 */
export const generateToken = (payload, expiresIn = JWT_EXPIRES_IN) => {
  console.log(JWT_SECRET)
  console.log(expiresIn)
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Generate access and refresh tokens
 * @param {Object} user - User object
 * @returns {Object} Object containing access and refresh tokens
 */
export const generateTokens = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = generateToken(payload, JWT_EXPIRES_IN);
  const refreshToken = generateToken(payload, JWT_REFRESH_EXPIRES_IN);

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object} Decoded token payload
 */
export const verifyToken = (token) => {
  try {

    const decoded = jwt.verify(token, JWT_SECRET);

    return decoded;
  } catch (error) {
    console.error(" Token verification error:", error.message);
    console.error("Error name:", error.name);
    console.error("Stack trace:", error.stack);

    if (error.name === "TokenExpiredError") {
      throw new Error("jwt expired");
    }
    if (error.name === "JsonWebTokenError") {
      throw new Error("Invalid token");
    }
    throw new Error("Token verification failed");
  }
};

/**
 * Decode JWT token without verification (for debugging)
 * @param {string} token - JWT token to decode
 * @returns {Object} Decoded token payload
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Extract token from Authorization header
 * @param {string} authHeader - Authorization header value
 * @returns {string|null} Extracted token or null
 */
export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};
