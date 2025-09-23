const express = require('express');
const SheepController = require('../controllers/SheepController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validateSheep, validateSheepUpdate, validateUuidParam, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/sheeps:
 *   get:
 *     summary: Get all sheeps
 *     tags: [Sheeps]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Search by sheep name
 *     responses:
 *       200:
 *         description: List of sheeps retrieved successfully
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
 *                         sheeps:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Sheep'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', optionalAuth, validatePagination, SheepController.getAll);

/**
 * @swagger
 * /api/sheeps/{id}:
 *   get:
 *     summary: Get sheep by ID
 *     tags: [Sheeps]
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
 *         description: Sheep retrieved successfully
 *       404:
 *         description: Sheep not found
 */
router.get('/:id', optionalAuth, validateUuidParam, SheepController.getById);

/**
 * @swagger
 * /api/sheeps:
 *   post:
 *     summary: Create a new sheep
 *     tags: [Sheeps]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Sheep'
 *     responses:
 *       201:
 *         description: Sheep created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */
router.post('/', authMiddleware, validateSheep, SheepController.create);

/**
 * @swagger
 * /api/sheeps/{id}:
 *   put:
 *     summary: Update sheep by ID
 *     tags: [Sheeps]
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
 *               name:
 *                 type: string
 *               age:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Sheep updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sheep not found
 */
router.put('/:id', authMiddleware, validateUuidParam, validateSheepUpdate, SheepController.update);

/**
 * @swagger
 * /api/sheeps/{id}:
 *   delete:
 *     summary: Delete sheep by ID
 *     tags: [Sheeps]
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
 *         description: Sheep deleted successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sheep not found
 */
router.delete('/:id', authMiddleware, validateUuidParam, SheepController.delete);

module.exports = router;