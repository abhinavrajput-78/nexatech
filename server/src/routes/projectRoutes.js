const express = require('express');
const router = express.Router();
const { getProjects, getCategories, getProjectBySlug } = require('../controllers/projectController');

router.get('/', getProjects);
router.get('/categories', getCategories);
router.get('/:slug', getProjectBySlug);

module.exports = router;
