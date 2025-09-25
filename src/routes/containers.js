const express = require('express');
const ContainerController = require('../controllers/ContainerController');
const { authMiddleware, optionalAuth, adminMiddleware } = require('../middleware/auth');
const { validateContainer, validateContainerUpdate, validateUuidParam, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/containers:
 *   get:
 *     summary: Get all containers with pagination
 *     tags: [Containers]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of containers to return (max 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of containers to skip
 *       - in: query
 *         name: student_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter containers by user ID
 *     responses:
 *       200:
 *         description: List of containers retrieved successfully
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
 *                         containers:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Container'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/', optionalAuth, validatePagination, ContainerController.getAll);

/**
 * @swagger
 * /api/containers/{id}:
 *   get:
 *     summary: Get container by ID
 *     tags: [Containers]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Container ID
 *     responses:
 *       200:
 *         description: Container retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Container'
 *       404:
 *         description: Container not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', optionalAuth, validateUuidParam, ContainerController.getById);

/**
 * @swagger
 * /api/containers:
 *   post:
 *     summary: Create a new container (Admin only)
 *     tags: [Containers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Container'
 *           example:
 *             code: "CONT001"
 *             location: "Warehouse A, Section 1"
 *             student_id: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       201:
 *         description: Container created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error or container code already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', adminMiddleware, validateContainer, ContainerController.create);

/**
 * @swagger
 * /api/containers/{id}:
 *   put:
 *     summary: Update container by ID (Admin only)
 *     tags: [Containers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Container ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: string
 *                 maxLength: 50
 *               location:
 *                 type: string
 *                 maxLength: 100
 *               student_id:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Container updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Container not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/:id', adminMiddleware, validateUuidParam, validateContainerUpdate, ContainerController.update);

/**
 * @swagger
 * /api/containers/{id}:
 *   delete:
 *     summary: Delete container by ID (Admin only)
 *     tags: [Containers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Container ID
 *     responses:
 *       200:
 *         description: Container deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Container not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', adminMiddleware, validateUuidParam, ContainerController.delete);

module.exports = router;