const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const { validateProjectUrls } = require('../middleware/validator');
const {
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
} = require('../controllers/adminController');

// All admin routes strictly require valid authentication cookie / session
router.use(requireAuth);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Content
router.get('/content', getAdminContent);
router.put('/content', updateAdminContent);

// Testimonials
router.get('/testimonials', getAdminTestimonials);
router.post('/testimonials', createTestimonial);
router.put('/testimonials/:id', updateTestimonial);
router.delete('/testimonials/:id', deleteTestimonial);

// Services
router.get('/services', getAdminServices);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

// Projects
router.get('/projects', getAdminProjects);
router.post('/projects', validateProjectUrls, createProject);
router.put('/projects/:id', validateProjectUrls, updateProject);
router.delete('/projects/:id', deleteProject);

// Contacts
router.get('/contacts', getAdminContacts);
router.get('/contacts/:id', getAdminContactById);
router.patch('/contacts/:id/status', updateContactStatus);
router.delete('/contacts/:id', deleteContact);

module.exports = router;
