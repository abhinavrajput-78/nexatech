const Service = require('../models/Service');
const Project = require('../models/Project');
const Testimonial = require('../models/Testimonial');
const SiteContent = require('../models/SiteContent');
const Contact = require('../models/Contact');
const { isConnected } = require('../config/db');
const { defaultContent } = require('./contentController');

// Helper to ensure slug is URL-safe
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// ==================== DASHBOARD ====================
const getDashboardStats = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({
        success: false,
        message: 'Database is currently unavailable.',
      });
    }

    const [
      totalServices,
      activeServices,
      totalProjects,
      publishedProjects,
      totalTestimonials,
      totalContacts,
      pendingContacts,
      contactedCount,
      resolvedContacts,
      recentContacts,
    ] = await Promise.all([
      Service.countDocuments(),
      Service.countDocuments({ isActive: true }),
      Project.countDocuments(),
      Project.countDocuments({ isPublished: true }),
      Testimonial.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'pending' }),
      Contact.countDocuments({ status: 'contacted' }),
      Contact.countDocuments({ status: 'resolved' }),
      Contact.find().sort({ createdAt: -1 }).limit(6),
    ]);

    // Calculate six-month enquiry analytics
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);

    const monthlyStats = await Contact.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
    ]);

    // Format the 6 months sequence even if some months have 0 count
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const analytics = [];
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const year = d.getFullYear();
      const month = d.getMonth() + 1;
      const monthLabel = `${monthNames[d.getMonth()]} ${year}`;

      const found = monthlyStats.find((s) => s._id.year === year && s._id.month === month);
      analytics.push({
        label: monthLabel,
        month: monthNames[d.getMonth()],
        year,
        count: found ? found.count : 0,
      });
    }

    return res.status(200).json({
      success: true,
      stats: {
        services: { total: totalServices, active: activeServices },
        projects: { total: totalProjects, published: publishedProjects },
        testimonials: { total: totalTestimonials },
        contacts: {
          total: totalContacts,
          pending: pendingContacts,
          contacted: contactedCount,
          resolved: resolvedContacts,
        },
      },
      analytics,
      recentContacts,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SITE CONTENT ====================
const getAdminContent = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ success: false, message: 'Database offline' });
    }

    let content = await SiteContent.findOne();
    if (!content) {
      content = await SiteContent.create(defaultContent);
    }

    return res.status(200).json({ success: true, data: content });
  } catch (error) {
    next(error);
  }
};

const updateAdminContent = async (req, res, next) => {
  try {
    if (!isConnected()) {
      return res.status(503).json({ success: false, message: 'Database offline' });
    }

    const updateData = req.body;
    let content = await SiteContent.findOne();

    if (!content) {
      content = new SiteContent(updateData);
    } else {
      Object.assign(content, updateData);
    }

    await content.save();

    return res.status(200).json({
      success: true,
      message: 'Website content updated successfully',
      data: content,
    });
  } catch (error) {
    next(error);
  }
};

// ==================== SERVICES ====================
const getAdminServices = async (req, res, next) => {
  try {
    const services = await Service.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: services });
  } catch (error) {
    next(error);
  }
};

const createService = async (req, res, next) => {
  try {
    const { title, slug, shortDescription, description, icon, features, benefits, faqs, order, isActive } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(title);

    // Format features & benefits if sent as string or array
    const formattedFeatures = Array.isArray(features)
      ? features
      : typeof features === 'string'
      ? features.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const formattedBenefits = Array.isArray(benefits)
      ? benefits
      : typeof benefits === 'string'
      ? benefits.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const service = new Service({
      title,
      slug: generatedSlug,
      shortDescription,
      description,
      icon: icon || 'Code',
      features: formattedFeatures,
      benefits: formattedBenefits,
      faqs: Array.isArray(faqs) ? faqs : [],
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
    });

    await service.save();

    return res.status(201).json({
      success: true,
      message: 'Service created successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, slug, shortDescription, description, icon, features, benefits, faqs, order, isActive } = req.body;

    const service = await Service.findById(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }

    if (title) service.title = title;
    if (slug) service.slug = slugify(slug);
    if (shortDescription) service.shortDescription = shortDescription;
    if (description) service.description = description;
    if (icon) service.icon = icon;
    if (features !== undefined) {
      service.features = Array.isArray(features)
        ? features
        : typeof features === 'string'
        ? features.split('\n').map((s) => s.trim()).filter(Boolean)
        : service.features;
    }
    if (benefits !== undefined) {
      service.benefits = Array.isArray(benefits)
        ? benefits
        : typeof benefits === 'string'
        ? benefits.split('\n').map((s) => s.trim()).filter(Boolean)
        : service.benefits;
    }
    if (faqs !== undefined) {
      service.faqs = Array.isArray(faqs) ? faqs : service.faqs;
    }
    if (order !== undefined) service.order = order;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    return res.status(200).json({
      success: true,
      message: 'Service updated successfully',
      data: service,
    });
  } catch (error) {
    next(error);
  }
};

const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const service = await Service.findByIdAndDelete(id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found' });
    }
    return res.status(200).json({ success: true, message: 'Service deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== PROJECTS ====================
const getAdminProjects = async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: projects });
  } catch (error) {
    next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const {
      title,
      slug,
      category,
      client,
      summary,
      challenge,
      solution,
      results,
      techStack,
      image,
      demoUrl,
      githubUrl,
      featured,
      isPublished,
      order,
    } = req.body;

    const generatedSlug = slug ? slugify(slug) : slugify(title);

    const formattedResults = Array.isArray(results)
      ? results
      : typeof results === 'string'
      ? results.split('\n').map((s) => s.trim()).filter(Boolean)
      : [];

    const formattedTechStack = Array.isArray(techStack)
      ? techStack
      : typeof techStack === 'string'
      ? techStack.split(',').map((s) => s.trim()).filter(Boolean)
      : [];

    const project = new Project({
      title,
      slug: generatedSlug,
      category,
      client: client || 'Confidential Client',
      summary,
      challenge: challenge || '',
      solution: solution || '',
      results: formattedResults,
      techStack: formattedTechStack,
      image: image || '',
      demoUrl: demoUrl || '',
      githubUrl: githubUrl || '',
      featured: featured !== undefined ? featured : false,
      isPublished: isPublished !== undefined ? isPublished : true,
      order: order || 0,
    });

    await project.save();

    return res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    const fields = [
      'title',
      'category',
      'client',
      'summary',
      'challenge',
      'solution',
      'image',
      'demoUrl',
      'githubUrl',
      'featured',
      'isPublished',
      'order',
    ];

    fields.forEach((f) => {
      if (req.body[f] !== undefined) {
        project[f] = req.body[f];
      }
    });

    if (req.body.slug) {
      project.slug = slugify(req.body.slug);
    }

    if (req.body.results !== undefined) {
      project.results = Array.isArray(req.body.results)
        ? req.body.results
        : typeof req.body.results === 'string'
        ? req.body.results.split('\n').map((s) => s.trim()).filter(Boolean)
        : project.results;
    }

    if (req.body.techStack !== undefined) {
      project.techStack = Array.isArray(req.body.techStack)
        ? req.body.techStack
        : typeof req.body.techStack === 'string'
        ? req.body.techStack.split(',').map((s) => s.trim()).filter(Boolean)
        : project.techStack;
    }

    await project.save();

    return res.status(200).json({
      success: true,
      message: 'Project updated successfully',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const project = await Project.findByIdAndDelete(id);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }
    return res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== TESTIMONIALS ====================
const getAdminTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find().sort({ order: 1, createdAt: -1 });
    return res.status(200).json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const createTestimonial = async (req, res, next) => {
  try {
    const { clientName, role, company, content, rating, avatar, isPublished, order } = req.body;

    const testimonial = new Testimonial({
      clientName,
      role,
      company,
      content,
      rating: rating || 5,
      avatar: avatar || '',
      isPublished: isPublished !== undefined ? isPublished : false,
      order: order || 0,
    });

    await testimonial.save();

    return res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }

    Object.assign(testimonial, req.body);
    await testimonial.save();

    return res.status(200).json({
      success: true,
      message: 'Testimonial updated successfully',
      data: testimonial,
    });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const testimonial = await Testimonial.findByIdAndDelete(id);
    if (!testimonial) {
      return res.status(404).json({ success: false, message: 'Testimonial not found' });
    }
    return res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// ==================== CONTACTS / ENQUIRIES ====================
const getAdminContacts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const search = req.query.search ? req.query.search.trim() : '';
    const status = req.query.status ? req.query.status.trim() : '';

    const filter = {};

    if (status && ['pending', 'contacted', 'resolved'].includes(status)) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
        { message: { $regex: search, $options: 'i' } },
        { selectedService: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Contact.countDocuments(filter);
    const contacts = await Contact.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const totalPages = Math.ceil(total / limit) || 1;

    return res.status(200).json({
      success: true,
      data: contacts,
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

const getAdminContactById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact enquiry not found' });
    }
    return res.status(200).json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'contacted', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be one of: pending, contacted, resolved',
      });
    }

    const contact = await Contact.findByIdAndUpdate(id, { status }, { new: true });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact enquiry not found' });
    }

    return res.status(200).json({
      success: true,
      message: `Enquiry status updated to ${status}`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact enquiry not found' });
    }
    return res.status(200).json({ success: true, message: 'Contact enquiry deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAdminContent,
  updateAdminContent,
  getAdminServices,
  createService,
  updateService,
  deleteService,
  getAdminProjects,
  createProject,
  updateProject,
  deleteProject,
  getAdminTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getAdminContacts,
  getAdminContactById,
  updateContactStatus,
  deleteContact,
};
