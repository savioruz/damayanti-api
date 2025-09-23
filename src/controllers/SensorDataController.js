const SensorData = require('../models/SensorData');
class SensorDataController {
  // GET /api/sensor-data
  static async getAll(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        container_id, 
        student_id, 
        date_from, 
        date_to 
      } = req.query;
      const filters = {};
      if (container_id) filters.container_id = container_id;
      if (student_id) filters.student_id = student_id;
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;
      const sensorData = await SensorData.findAll(parseInt(limit), parseInt(offset), filters);
      const total = await SensorData.count(filters);
      res.json({
        sensorData,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // GET /api/sensor-data/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const sensorData = await SensorData.findById(id);
      if (!sensorData) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      res.json({
        data: sensorData
      });
    } catch (error) {
      console.error('Error fetching sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // GET /api/sensor-data/latest/:container_id
  static async getLatestByContainer(req, res) {
    try {
      const { container_id } = req.params;
      const sensorData = await SensorData.getLatestByContainer(container_id);
      if (!sensorData) {
        return res.status(404).json({
          message: 'No sensor data found for this container'
        });
      }
      res.json({
        data: sensorData
      });
    } catch (error) {
      console.error('Error fetching latest sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // POST /api/sensor-data
  static async create(req, res) {
    try {
      const { container_id, temperature, humidity, gas, ph, student_id } = req.body;
      const sensorDataObj = {
        container_id,
        temperature,
        humidity,
        gas,
        ph,
        student_id,
        created_by: req.user?.id || student_id,
        modified_by: req.user?.id || student_id
      };
      const sensorData = new SensorData(sensorDataObj);
      await sensorData.save();
      res.status(201).json({
        message: 'Sensor data created successfully'
      });
    } catch (error) {
      console.error('Error creating sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // PUT /api/sensor-data/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { container_id, temperature, humidity, gas, ph, student_id } = req.body;
      const existingSensorData = await SensorData.findById(id);
      if (!existingSensorData) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      const updateData = {};
      if (container_id) updateData.container_id = container_id;
      if (temperature !== undefined) updateData.temperature = temperature;
      if (humidity !== undefined) updateData.humidity = humidity;
      if (gas !== undefined) updateData.gas = gas;
      if (ph !== undefined) updateData.ph = ph;
      if (student_id) updateData.student_id = student_id;
      await SensorData.update(id, updateData, req.user?.id || existingSensorData.modified_by);
      res.json({
        message: 'Sensor data updated successfully'
      });
    } catch (error) {
      console.error('Error updating sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // DELETE /api/sensor-data/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existingSensorData = await SensorData.findById(id);
      if (!existingSensorData) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      await SensorData.delete(id);
      res.json({
        message: 'Sensor data deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting sensor data:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
module.exports = SensorDataController;