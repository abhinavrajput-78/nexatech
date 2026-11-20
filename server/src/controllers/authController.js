const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const config = require('../config/env');
const { isConnected } = require('../config/db');

const generateToken = (admin) => {
  return jwt.sign(
    {
      id: admin._id,
      email: admin.email,
      name: admin.name,
      role: admin.role,
    },
    config.JWT_SECRET,
    { expiresIn: '8h' }
  );
};

const setAuthCookie = (res, token) => {
  const isHttps = config.IS_PROD;
  res.cookie('token', token, {
    httpOnly: true,
    secure: isHttps,
    sameSite: isHttps ? 'strict' : 'lax',
    maxAge: 8 * 60 * 60 * 1000, // 8 hours
    path: '/',
  });
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database service is currently unavailable. Please try again later.',
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    const token = generateToken(admin);
    setAuthCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Logged in successfully',
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: config.IS_PROD,
    sameSite: config.IS_PROD ? 'strict' : 'lax',
    path: '/',
  });
  return res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

const getMe = async (req, res) => {
  try {
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        admin: null,
      });
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(200).json({
        success: true,
        authenticated: false,
        admin: null,
      });
    }

    if (isConnected()) {
      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!admin) {
        return res.status(200).json({
          success: true,
          authenticated: false,
          admin: null,
        });
      }
      return res.status(200).json({
        success: true,
        authenticated: true,
        admin,
      });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      admin: {
        _id: decoded.id,
        email: decoded.email,
        name: decoded.name || 'Admin',
        role: decoded.role || 'admin',
      },
    });
  } catch (_) {
    return res.status(200).json({
      success: true,
      authenticated: false,
      admin: null,
    });
  }
};

module.exports = {
  login,
  logout,
  getMe,
  generateToken,
  setAuthCookie,
};
