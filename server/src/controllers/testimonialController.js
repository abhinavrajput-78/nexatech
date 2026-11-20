const Testimonial = require('../models/Testimonial');
const { isConnected } = require('../config/db');

// @desc    Get published testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    const testimonials = await Testimonial.find({ isPublished: true }).sort({ order: 1, createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
};
