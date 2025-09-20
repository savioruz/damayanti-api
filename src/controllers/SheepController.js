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
        success: true,
        data: sheeps,
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
        success: false,
        message: 'Internal server error',
        error: error.message
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
          success: false,
          message: 'Sheep not found'
        });
      }

      res.json({
        success: true,
        data: sheep
      });
    } catch (error) {
      console.error('Error fetching sheep:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
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
      const savedSheep = await sheep.save();

      res.status(201).json({
        success: true,
        message: 'Sheep created successfully',
        data: savedSheep
      });
    } catch (error) {
      console.error('Error creating sheep:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
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
          success: false,
          message: 'Sheep not found'
        });
      }

      const updateData = {};
      if (name) updateData.name = name;
      if (age !== undefined) updateData.age = age;

      const updatedSheep = await Sheep.update(id, updateData, req.user?.id || existingSheep.modified_by);

      res.json({
        success: true,
        message: 'Sheep updated successfully',
        data: updatedSheep
      });
    } catch (error) {
      console.error('Error updating sheep:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
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
          success: false,
          message: 'Sheep not found'
        });
      }

      await Sheep.delete(id);

      res.json({
        success: true,
        message: 'Sheep deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting sheep:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = SheepController;