import User from "../models/User.js";

// Enhanced admin middleware with additional security checks
export const adminOnly = (req, res, next) => {
  // This middleware assumes auth middleware has already run
  if (!req.user) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      error: "Forbidden: Admin access required",
      required: "admin",
      current: req.user.role 
    });
  }

  return next();
};

// Rate limiting for admin endpoints (basic implementation)
const adminRateLimit = new Map();

export const adminRateLimitMiddleware = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const adminId = req.user?.id;
    if (!adminId) return next();

    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (adminRateLimit.has(adminId)) {
      const requests = adminRateLimit.get(adminId).filter(time => time > windowStart);
      adminRateLimit.set(adminId, requests);
    }

    // Check current request count
    const requests = adminRateLimit.get(adminId) || [];
    if (requests.length >= maxRequests) {
      return res.status(429).json({
        error: "Too many admin requests",
        message: `Maximum ${maxRequests} requests per ${Math.floor(windowMs / 60000)} minutes`,
        retryAfter: Math.ceil((requests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    requests.push(now);
    adminRateLimit.set(adminId, requests);

    next();
  };
};

// Admin action logging middleware
export const logAdminAction = (action) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      // Log admin action
      const logData = {
        adminId: req.user?.id,
        adminEmail: req.user?.email,
        action,
        method: req.method,
        url: req.originalUrl,
        timestamp: new Date().toISOString(),
        ip: req.ip || req.connection.remoteAddress,
        userAgent: req.get('User-Agent'),
        statusCode: res.statusCode,
        success: res.statusCode < 400
      };

      console.log('[ADMIN_ACTION]', JSON.stringify(logData));
      
      // Call original send
      originalSend.call(this, data);
    };

    next();
  };
};

// Validate admin permissions for specific actions
export const validateAdminPermissions = (requiredPermissions = []) => {
  return async (req, res, next) => {
    try {
      const adminId = req.user?.id;
      
      // Get fresh admin user data from database
      const admin = await User.findById(adminId);
      if (!admin || admin.role !== 'admin') {
        return res.status(403).json({ 
          error: "Admin access required",
          code: "ADMIN_REQUIRED" 
        });
      }

      // Check if admin account is active (you might want to add an 'active' field)
      // For now, we'll just ensure the user exists and has admin role
      
      // Store admin info in request for use in controllers
      req.admin = {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        permissions: requiredPermissions // You can extend this with actual permission system
      };

      next();
    } catch (error) {
      console.error('Admin permission validation error:', error);
      res.status(500).json({ error: "Failed to validate admin permissions" });
    }
  };
};

// Audit trail middleware for sensitive admin operations
export const auditTrail = (operation) => {
  return (req, res, next) => {
    const originalSend = res.send;
    
    res.send = function(data) {
      if (res.statusCode < 400) {
        // Log successful sensitive operation
        const auditData = {
          adminId: req.user?.id,
          adminEmail: req.user?.email,
          operation,
          targetId: req.params.userId || req.params.jobId || req.params.applicationId,
          method: req.method,
          url: req.originalUrl,
          timestamp: new Date().toISOString(),
          ip: req.ip || req.connection.remoteAddress,
          userAgent: req.get('User-Agent'),
          requestBody: req.method !== 'GET' ? req.body : undefined
        };

        console.log('[ADMIN_AUDIT]', JSON.stringify(auditData));
      }
      
      originalSend.call(this, data);
    };

    next();
  };
};

// Middleware to prevent admin from performing actions on themselves
export const preventSelfAction = (req, res, next) => {
  const targetUserId = req.params.userId;
  const adminId = req.user?.id;

  if (targetUserId === adminId) {
    return res.status(400).json({
      error: "Cannot perform this action on your own account",
      code: "SELF_ACTION_PREVENTED"
    });
  }

  next();
};

// Middleware to validate admin action parameters
export const validateAdminParams = (paramValidationRules = {}) => {
  return (req, res, next) => {
    const errors = [];

    for (const [param, rules] of Object.entries(paramValidationRules)) {
      const value = req.params[param] || req.body[param];

      if (rules.required && !value) {
        errors.push(`${param} is required`);
        continue;
      }

      if (value && rules.type) {
        switch (rules.type) {
          case 'ObjectId':
            if (!value.match(/^[0-9a-fA-F]{24}$/)) {
              errors.push(`${param} must be a valid MongoDB ObjectId`);
            }
            break;
          case 'email':
            if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
              errors.push(`${param} must be a valid email address`);
            }
            break;
          case 'role':
            if (!['employee', 'employer', 'admin'].includes(value)) {
              errors.push(`${param} must be one of: employee, employer, admin`);
            }
            break;
          case 'status':
            const validStatuses = rules.allowed || ['OPEN', 'CLOSED', 'applied', 'shortlisted', 'rejected'];
            if (!validStatuses.includes(value)) {
              errors.push(`${param} must be one of: ${validStatuses.join(', ')}`);
            }
            break;
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        details: errors
      });
    }

    next();
  };
};
