const jwt = require('jsonwebtoken');
const config = require('../config/env');
const Admin = require('../models/Admin');
const { isConnected } = require('../config/db');

const requireAuth = async (req, res, next) => {
  try {
    let token = null;

    // 1. Try reading HTTP-only cookie
    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } 
    // 2. Fallback to Authorization Bearer header
    else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required: No token provided',
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token',
      });
    }

    // Check database user if DB is connected
    if (isConnected()) {
      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!admin) {
        return res.status(401).json({
          success: false,
          message: 'Admin account not found or deactivated',
        });
      }
      req.admin = admin;
    } else {
      // If DB is offline but token is validly signed with JWT_SECRET (useful in tests/offline)
      req.admin = {
        _id: decoded.id,
        email: decoded.email,
        role: decoded.role || 'admin',
        name: decoded.name || 'Admin',
      };
    }

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session has expired, please log in again',
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid credentials or token',
    });
  }
};

module.exports = {
  requireAuth,
};
