const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimiter');
const { validateLoginInput } = require('../middleware/validator');

router.post('/login', authLimiter, validateLoginInput, login);
router.post('/logout', logout);
router.get('/me', getMe);

module.exports = router;
