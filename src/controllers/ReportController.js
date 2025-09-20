const Report = require('../models/Report');

class ReportController {
  // GET /api/reports
  static async getAll(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        user_id, 
        container_id 
      } = req.query;
      
      const filters = {};
      if (user_id) filters.user_id = user_id;
      if (container_id) filters.container_id = container_id;

      const reports = await Report.findAll(parseInt(limit), parseInt(offset), filters);
      const total = await Report.count(filters);
      
      res.json({
        success: true,
        data: reports,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET /api/reports/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const report = await Report.findById(id);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      res.json({
        success: true,
        data: report
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // POST /api/reports
  static async create(req, res) {
    try {
      const { user_id, container_id, notes } = req.body;

      const reportData = {
        user_id,
        container_id,
        notes,
        created_by: req.user?.id || user_id,
        modified_by: req.user?.id || user_id
      };

      const report = new Report(reportData);
      const savedReport = await report.save();

      res.status(201).json({
        success: true,
        message: 'Report created successfully',
        data: savedReport
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // PUT /api/reports/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { user_id, container_id, notes } = req.body;
      
      const existingReport = await Report.findById(id);
      if (!existingReport) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      const updateData = {};
      if (user_id) updateData.user_id = user_id;
      if (container_id) updateData.container_id = container_id;
      if (notes !== undefined) updateData.notes = notes;

      const updatedReport = await Report.update(id, updateData, req.user?.id || existingReport.modified_by);

      res.json({
        success: true,
        message: 'Report updated successfully',
        data: updatedReport
      });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // DELETE /api/reports/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const existingReport = await Report.findById(id);
      if (!existingReport) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      await Report.delete(id);

      res.json({
        success: true,
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = ReportController;