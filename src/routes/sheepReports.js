const express = require('express');
const SheepReportController = require('../controllers/SheepReportController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validateSheepReport, validateSheepReportUpdate, validateUuidParam, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/sheep-reports:
 *   get:
 *     summary: Get all sheep reports
 *     tags: [Sheep Reports]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of sheep reports to return (max 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: sheep_id
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date-time
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date-time
 *     responses:
 *       200:
 *         description: List of sheep reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         sheepReports:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SheepReport'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', optionalAuth, validatePagination, SheepReportController.getAll);

/**
 * @swagger
 * /api/sheep-reports/recent/{status}:
 *   get:
 *     summary: Get recent sheep reports by status
 *     tags: [Sheep Reports]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: status
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Recent sheep reports retrieved successfully
 */
router.get('/recent/:status', optionalAuth, SheepReportController.getRecentByStatus);

/**
 * @swagger
 * /api/sheep-reports/{id}:
 *   get:
 *     summary: Get sheep report by ID
 *     tags: [Sheep Reports]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sheep report retrieved successfully
 *       404:
 *         description: Sheep report not found
 */
router.get('/:id', optionalAuth, validateUuidParam, SheepReportController.getById);

/**
 * @swagger
 * /api/sheep-reports:
 *   post:
 *     summary: Create a new sheep report
 *     tags: [Sheep Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SheepReport'
 *           example:
 *             sheep_id: "123e4567-e89b-12d3-a456-426614174000"
 *             feeding_time: "2025-09-20T08:00:00Z"
 *             status: "fed"
 *     responses:
 *       201:
 *         description: Sheep report created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validateSheepReport, SheepReportController.create);

/**
 * @swagger
 * /api/sheep-reports/{id}:
 *   put:
 *     summary: Update sheep report by ID
 *     tags: [Sheep Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sheep_id:
 *                 type: string
 *                 format: uuid
 *               feeding_time:
 *                 type: string
 *                 format: date-time
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sheep report updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sheep report not found
 */
router.put('/:id', authMiddleware, validateUuidParam, validateSheepReportUpdate, SheepReportController.update);

/**
 * @swagger
 * /api/sheep-reports/{id}:
 *   delete:
 *     summary: Delete sheep report by ID
 *     tags: [Sheep Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Sheep report deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sheep report not found
 */
router.delete('/:id', authMiddleware, validateUuidParam, SheepReportController.delete);

module.exports = router;