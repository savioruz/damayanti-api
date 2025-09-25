const Container = require('../models/Container');
class ContainerController {
  // GET /api/containers
  static async getAll(req, res) {
    try {
      const { limit = 10, offset = 0 } = req.query;
      const parsedLimit = Math.min(parseInt(limit), 100);
      const containers = await Container.findAll(parsedLimit, parseInt(offset));
      const total = await Container.count();
      res.json({
        data: {
          containers,
          pagination: {
            total,
            limit: parsedLimit,
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parsedLimit < total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching containers:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // GET /api/containers/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const container = await Container.findById(id);
      if (!container) {
        return res.status(404).json({
          error: 'Container not found'
        });
      }
      res.json({
        data: container
      });
    } catch (error) {
      console.error('Error fetching container:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // POST /api/containers
  static async create(req, res) {
    try {
      const { code } = req.body;
      // Check if container code already exists
      const existingContainer = await Container.findByCode(code);
      if (existingContainer) {
        return res.status(400).json({
          error: 'Container with this code already exists'
        });
      }
      const containerData = {
        code,
        created_by: req.user?.id || null,
        modified_by: req.user?.id || null
      };
      const container = new Container(containerData);
      await container.save();
      res.status(201).json({
        message: 'Container created successfully'
      });
    } catch (error) {
      console.error('Error creating container:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // PUT /api/containers/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { code } = req.body;
      const existingContainer = await Container.findById(id);
      if (!existingContainer) {
        return res.status(404).json({
          error: 'Container not found'
        });
      }
      // Check if new code conflicts with existing container
      if (code && code !== existingContainer.code) {
        const codeExists = await Container.findByCode(code);
        if (codeExists) {
          return res.status(400).json({
            error: 'Container with this code already exists'
          });
        }
      }
      const updateData = {};
      if (code) updateData.code = code;
      await Container.update(id, updateData, req.user?.id || existingContainer.modified_by);
      res.json({
        message: 'Container updated successfully'
      });
    } catch (error) {
      console.error('Error updating container:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // DELETE /api/containers/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existingContainer = await Container.findById(id);
      if (!existingContainer) {
        return res.status(404).json({
          error: 'Container not found'
        });
      }
      await Container.delete(id);
      res.json({
        message: 'Container deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting container:', error);
      if (error.message.includes('violates foreign key constraint')) {
        return res.status(400).json({
          error: 'Invalid reference to another resource'
        });
      }
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
module.exports = ContainerController;