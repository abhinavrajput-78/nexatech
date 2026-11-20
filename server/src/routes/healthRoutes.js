const express = require('express');
const router = express.Router();
const { isConnected } = require('../config/db');

router.get('/', (req, res) => {
  const dbStatus = isConnected() ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: dbStatus,
    service: 'NexaTech Enterprise API',
  });
});

module.exports = router;
