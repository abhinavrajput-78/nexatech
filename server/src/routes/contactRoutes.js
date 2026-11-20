const express = require('express');
const router = express.Router();
const { submitContact } = require('../controllers/contactController');
const { contactLimiter } = require('../middleware/rateLimiter');
const { validateContactInput } = require('../middleware/validator');

router.post('/', contactLimiter, validateContactInput, submitContact);

module.exports = router;
