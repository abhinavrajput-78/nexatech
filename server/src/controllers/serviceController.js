const Service = require('../models/Service');
const { isConnected } = require('../config/db');

// @desc    Get all active services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please verify MongoDB connection.',
      });
    }

    const services = await Service.find({ isActive: true }).sort({ order: 1, createdAt: 1 });

    return res.status(200).json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single service by slug
// @route   GET /api/services/:slug
// @access  Public
const getServiceBySlug = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please verify MongoDB connection.',
      });
    }

    const { slug } = req.params;
    const service = await Service.findOne({ slug: slug.toLowerCase(), isActive: true });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: `Service with slug '${slug}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceBySlug,
};
