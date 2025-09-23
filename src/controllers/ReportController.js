const Report = require('../models/Report');
class ReportController {
  // GET /api/reports
  static async getAll(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        student_id, 
        container_id 
      } = req.query;
      const filters = {};
      if (student_id) filters.student_id = student_id;
      if (container_id) filters.container_id = container_id;
      const reports = await Report.findAll(parseInt(limit), parseInt(offset), filters);
      const total = await Report.count(filters);
      res.json({
        data: {
          reports,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching reports:', error);
      res.status(500).json({
        error: 'Internal server error'
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
          error: 'Resource not found'
        });
      }
      res.json({
        data: report
      });
    } catch (error) {
      console.error('Error fetching report:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // POST /api/reports
  static async create(req, res) {
    try {
      const { student_id, container_id, notes } = req.body;
      const reportData = {
        student_id,
        container_id,
        notes,
        created_by: req.user?.id || student_id,
        modified_by: req.user?.id || student_id
      };
      const report = new Report(reportData);
      await report.save();
      res.status(201).json({
        message: 'Report created successfully'
      });
    } catch (error) {
      console.error('Error creating report:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // PUT /api/reports/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { student_id, container_id, notes } = req.body;
      const existingReport = await Report.findById(id);
      if (!existingReport) {
        return res.status(404).json({
          error: 'Resource not found'
        });
      }
      const updateData = {};
      if (student_id) updateData.student_id = student_id;
      if (container_id) updateData.container_id = container_id;
      if (notes !== undefined) updateData.notes = notes;
      await Report.update(id, updateData, req.user?.id || existingReport.modified_by);
      res.json({
        message: 'Report updated successfully'
      });
    } catch (error) {
      console.error('Error updating report:', error);
      res.status(500).json({
        error: 'Internal server error'
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
          error: 'Resource not found'
        });
      }
      await Report.delete(id);
      res.json({
        message: 'Report deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting report:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
module.exports = ReportController;