const { verifyToken } = require('../utils/auth');
const User = require('../models/User');
const { USER_ROLES } = require('../constants/roles');

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        error: 'Access denied. No token provided.'
      });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id);
    
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token. User not found.'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      error: 'Invalid token.'
    });
  }
};

const adminMiddleware = async (req, res, next) => {
  try {
    // First run auth middleware
    await new Promise((resolve, reject) => {
      authMiddleware(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });

    // Check if user has admin role
    if (!req.user || req.user.role !== USER_ROLES.ADMIN) {
      return res.status(403).json({
        error: 'Access denied. Admin privileges required.'
      });
    }

    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    return res.status(401).json({
      error: 'Authentication failed.'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.id);
      if (user) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Optional auth - continue even if token is invalid
    console.log('Optional auth failed:', error.message);
    next();
  }
};

module.exports = {
  authMiddleware,
  adminMiddleware,
  optionalAuth
};