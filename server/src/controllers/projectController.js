const Project = require('../models/Project');
const { isConnected } = require('../config/db');

// @desc    Get published projects with search, filter, pagination
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable. Please verify MongoDB connection.',
      });
    }

    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const search = req.query.search ? req.query.search.trim() : '';
    const category = req.query.category ? req.query.category.trim() : '';

    const filter = { isPublished: true };

    if (category && category !== 'All') {
      filter.category = new RegExp(`^${category}$`, 'i');
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { summary: { $regex: search, $options: 'i' } },
        { techStack: { $regex: search, $options: 'i' } },
        { client: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ featured: -1, order: 1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: projects,
      pagination: {
        total,
        page,
        limit,
        totalPages,
        hasPrev: page > 1,
        hasNext: page < totalPages,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get distinct project categories
// @route   GET /api/projects/categories
// @access  Public
const getCategories = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    const categories = await Project.distinct('category', { isPublished: true });
    return res.status(200).json({
      success: true,
      data: ['All', ...categories.filter(Boolean)],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    const { slug } = req.params;
    const project = await Project.findOne({ slug: slug.toLowerCase(), isPublished: true });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: `Project with slug '${slug}' not found`,
      });
    }

    return res.status(200).json({
      success: true,
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProjects,
  getCategories,
  getProjectBySlug,
};
