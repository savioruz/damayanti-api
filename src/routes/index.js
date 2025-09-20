const express = require('express');
const { query } = require('../config/database');
const authRoutes = require('./auth');
const userRoutes = require('./users');
const containerRoutes = require('./containers');
const sensorDataRoutes = require('./sensorData');
const reportRoutes = require('./reports');
const sheepRoutes = require('./sheeps');
const sheepReportRoutes = require('./sheepReports');

const router = express.Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Health check endpoint with database connectivity
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API and database are running successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       500:
 *         description: Database connection failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/health', async (req, res) => {
  try {
    // Ping the database
    await query('SELECT 1');
    
    res.json({
      message: 'ok'
    });
  } catch (error) {
    console.error('Health check failed:', error);
    res.status(500).json({
      error: 'Database connection failed'
    });
  }
});

// API routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/containers', containerRoutes);
router.use('/sensor-data', sensorDataRoutes);
router.use('/reports', reportRoutes);
router.use('/sheeps', sheepRoutes);
router.use('/sheep-reports', sheepReportRoutes);

// 404 handler for API routes
router.use('*', (req, res) => {
  res.status(404).json({
    error: 'API endpoint not found'
  });
});

module.exports = router;