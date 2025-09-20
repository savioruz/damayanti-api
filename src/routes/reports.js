const express = require('express');
const ReportController = require('../controllers/ReportController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validateReport, validateReportUpdate } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Get all reports with pagination and filtering
 *     tags: [Reports]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of reports to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of reports to skip
 *       - in: query
 *         name: user_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by user ID
 *       - in: query
 *         name: container_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by container ID
 *     responses:
 *       200:
 *         description: List of reports retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', optionalAuth, ReportController.getAll);

/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Get report by ID
 *     tags: [Reports]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Report'
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', optionalAuth, ReportController.getById);

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Create a new report
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Report'
 *           example:
 *             user_id: "123e4567-e89b-12d3-a456-426614174000"
 *             container_id: "123e4567-e89b-12d3-a456-426614174001"
 *             notes: "Container inspection completed. All systems normal."
 *     responses:
 *       201:
 *         description: Report created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/', authMiddleware, validateReport, ReportController.create);

/**
 * @swagger
 * /api/reports/{id}:
 *   put:
 *     summary: Update report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Report ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 format: uuid
 *               container_id:
 *                 type: string
 *                 format: uuid
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Report updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', authMiddleware, validateReportUpdate, ReportController.update);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Delete report by ID
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Report ID
 *     responses:
 *       200:
 *         description: Report deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Report not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', authMiddleware, ReportController.delete);

module.exports = router;