const express = require('express');
const SensorDataController = require('../controllers/SensorDataController');
const { authMiddleware, optionalAuth } = require('../middleware/auth');
const { validateSensorData, validateSensorDataUpdate, validateUuidParam, validatePagination } = require('../middleware/validation');

const router = express.Router();

/**
 * @swagger
 * /api/sensor-data:
 *   get:
 *     summary: Get all sensor data with pagination and filtering
 *     tags: [Sensor Data]
 *     security: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Number of sensor data records to return (max 100)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of sensor data records to skip
 *       - in: query
 *         name: container_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by container ID
 *       - in: query
 *         name: date_from
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter records from this date
 *       - in: query
 *         name: date_to
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Filter records until this date
 *     responses:
 *       200:
 *         description: List of sensor data retrieved successfully
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
 *                         sensor_data:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/SensorData'
 *                         pagination:
 *                           $ref: '#/components/schemas/Pagination'
 *       500:
 *         description: Internal server error
 */
router.get('/', optionalAuth, validatePagination, SensorDataController.getAll);

/**
 * @swagger
 * /api/sensor-data/latest/{container_id}:
 *   get:
 *     summary: Get latest sensor data for a specific container
 *     tags: [Sensor Data]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: container_id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Container ID
 *     responses:
 *       200:
 *         description: Latest sensor data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: No sensor data found for this container
 *       500:
 *         description: Internal server error
 */
router.get('/latest/:container_id', optionalAuth, validateUuidParam, SensorDataController.getLatestByContainer);

/**
 * @swagger
 * /api/sensor-data/{id}:
 *   get:
 *     summary: Get sensor data by ID
 *     tags: [Sensor Data]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sensor data ID
 *     responses:
 *       200:
 *         description: Sensor data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/SuccessResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/SensorData'
 *       404:
 *         description: Sensor data not found
 *       500:
 *         description: Internal server error
 */
router.get('/:id', optionalAuth, validateUuidParam, SensorDataController.getById);

/**
 * @swagger
 * /api/sensor-data:
 *   post:
 *     summary: Create new sensor data record
 *     tags: [Sensor Data]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/SensorData'
 *     responses:
 *       201:
 *         description: Sensor data created successfully
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
router.post('/', validateSensorData, SensorDataController.create);

/**
 * @swagger
 * /api/sensor-data/{id}:
 *   put:
 *     summary: Update sensor data by ID
 *     tags: [Sensor Data]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sensor data ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               container_id:
 *                 type: string
 *                 format: uuid
 *               temperature:
 *                 type: number
 *                 format: decimal
 *               humidity:
 *                 type: number
 *                 format: decimal
 *               gas:
 *                 type: number
 *                 format: decimal
 *               ph:
 *                 type: number
 *                 format: decimal
 *               status:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sensor data updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sensor data not found
 *       500:
 *         description: Internal server error
 */
router.put('/:id', validateUuidParam, validateSensorDataUpdate, SensorDataController.update);

/**
 * @swagger
 * /api/sensor-data/{id}:
 *   delete:
 *     summary: Delete sensor data by ID
 *     tags: [Sensor Data]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Sensor data ID
 *     responses:
 *       200:
 *         description: Sensor data deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Sensor data not found
 *       500:
 *         description: Internal server error
 */
router.delete('/:id', validateUuidParam, SensorDataController.delete);

module.exports = router;