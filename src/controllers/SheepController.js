const Sheep = require('../models/Sheep');
class SheepController {
  // GET /api/sheeps
  static async getAll(req, res) {
    try {
      const { limit = 50, offset = 0, name } = req.query;
      let sheeps;
      let total;
      if (name) {
        sheeps = await Sheep.findByName(name);
        total = sheeps.length;
      } else {
        sheeps = await Sheep.findAll(parseInt(limit), parseInt(offset));
        total = await Sheep.count();
      }
      res.json({
        sheeps,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      });
    } catch (error) {
      console.error('Error fetching sheeps:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // GET /api/sheeps/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const sheep = await Sheep.findById(id);
      if (!sheep) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      res.json({
        data: sheep
      });
    } catch (error) {
      console.error('Error fetching sheep:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // POST /api/sheeps
  static async create(req, res) {
    try {
      const { name, age } = req.body;
      const sheepData = {
        name,
        age: age || 0,
        created_by: req.user?.id || 'system',
        modified_by: req.user?.id || 'system'
      };
      const sheep = new Sheep(sheepData);
      await sheep.save();
      res.status(201).json({
        message: 'Sheep created successfully'
      });
    } catch (error) {
      console.error('Error creating sheep:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // PUT /api/sheeps/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { name, age } = req.body;
      const existingSheep = await Sheep.findById(id);
      if (!existingSheep) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      const updateData = {};
      if (name) updateData.name = name;
      if (age !== undefined) updateData.age = age;
      await Sheep.update(id, updateData, req.user?.id || existingSheep.modified_by);
      res.json({
        message: 'Sheep updated successfully'
      });
    } catch (error) {
      console.error('Error updating sheep:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // DELETE /api/sheeps/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existingSheep = await Sheep.findById(id);
      if (!existingSheep) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      await Sheep.delete(id);
      res.json({
        message: 'Sheep deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting sheep:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
module.exports = SheepController;