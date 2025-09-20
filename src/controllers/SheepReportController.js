const SheepReport = require('../models/SheepReport');

class SheepReportController {
  // GET /api/sheep-reports
  static async getAll(req, res) {
    try {
      const { 
        limit = 50, 
        offset = 0, 
        sheep_id, 
        status,
        date_from,
        date_to
      } = req.query;
      
      const filters = {};
      if (sheep_id) filters.sheep_id = sheep_id;
      if (status) filters.status = status;
      if (date_from) filters.date_from = date_from;
      if (date_to) filters.date_to = date_to;

      const sheepReports = await SheepReport.findAll(parseInt(limit), parseInt(offset), filters);
      const total = await SheepReport.count(filters);
      
      res.json({
        success: true,
        data: sheepReports,
        pagination: {
          total,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: parseInt(offset) + parseInt(limit) < total
        }
      });
    } catch (error) {
      console.error('Error fetching sheep reports:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET /api/sheep-reports/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const sheepReport = await SheepReport.findById(id);
      
      if (!sheepReport) {
        return res.status(404).json({
          success: false,
          message: 'Sheep report not found'
        });
      }

      res.json({
        success: true,
        data: sheepReport
      });
    } catch (error) {
      console.error('Error fetching sheep report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // GET /api/sheep-reports/recent/:status
  static async getRecentByStatus(req, res) {
    try {
      const { status } = req.params;
      const { limit = 10 } = req.query;
      
      const sheepReports = await SheepReport.getRecentByStatus(status, parseInt(limit));
      
      res.json({
        success: true,
        data: sheepReports
      });
    } catch (error) {
      console.error('Error fetching recent sheep reports:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // POST /api/sheep-reports
  static async create(req, res) {
    try {
      const { sheep_id, feeding_time, status } = req.body;

      const sheepReportData = {
        sheep_id,
        feeding_time,
        status,
        created_by: req.user?.id || 'system',
        modified_by: req.user?.id || 'system'
      };

      const sheepReport = new SheepReport(sheepReportData);
      const savedSheepReport = await sheepReport.save();

      res.status(201).json({
        success: true,
        message: 'Sheep report created successfully',
        data: savedSheepReport
      });
    } catch (error) {
      console.error('Error creating sheep report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // PUT /api/sheep-reports/:id
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { sheep_id, feeding_time, status } = req.body;
      
      const existingSheepReport = await SheepReport.findById(id);
      if (!existingSheepReport) {
        return res.status(404).json({
          success: false,
          message: 'Sheep report not found'
        });
      }

      const updateData = {};
      if (sheep_id) updateData.sheep_id = sheep_id;
      if (feeding_time) updateData.feeding_time = feeding_time;
      if (status) updateData.status = status;

      const updatedSheepReport = await SheepReport.update(id, updateData, req.user?.id || existingSheepReport.modified_by);

      res.json({
        success: true,
        message: 'Sheep report updated successfully',
        data: updatedSheepReport
      });
    } catch (error) {
      console.error('Error updating sheep report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }

  // DELETE /api/sheep-reports/:id
  static async delete(req, res) {
    try {
      const { id } = req.params;
      
      const existingSheepReport = await SheepReport.findById(id);
      if (!existingSheepReport) {
        return res.status(404).json({
          success: false,
          message: 'Sheep report not found'
        });
      }

      await SheepReport.delete(id);

      res.json({
        success: true,
        message: 'Sheep report deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting sheep report:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error',
        error: error.message
      });
    }
  }
}

module.exports = SheepReportController;