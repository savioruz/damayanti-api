const Student = require('../models/Student');
class StudentController {
  // GET /api/students
  static async getAll(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;
      const students = await Student.findAll(parseInt(limit), parseInt(offset));
      const total = await Student.count();
      res.json({
        data: {
          students,
          pagination: {
            total,
            limit: parseInt(limit),
            offset: parseInt(offset),
            hasMore: parseInt(offset) + parseInt(limit) < total
          }
        }
      });
    } catch (error) {
      console.error('Error fetching students:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // GET /api/students/:id
  static async getById(req, res) {
    try {
      const { id } = req.params;
      const student = await Student.findById(id);
      if (!student) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }
      res.json({
        data: student
      });
    } catch (error) {
      console.error('Error fetching student:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // POST /api/students (Admin only)
  static async create(req, res) {
    try {
      const { full_name } = req.body;
      const studentData = {
        full_name,
        created_by: req.user?.id || null,
        modified_by: req.user?.id || null
      };
      const newStudent = new Student(studentData);
      await newStudent.save();
      res.status(201).json({
        message: 'Student created successfully'
      });
    } catch (error) {
      console.error('Error creating student:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // PUT /api/students/:id (Admin only)
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { full_name } = req.body;
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }
      const updateData = {};
      if (full_name) updateData.full_name = full_name;
      await Student.update(id, updateData, req.user?.id || existingStudent.modified_by);
      res.json({
        message: 'Student updated successfully'
      });
    } catch (error) {
      console.error('Error updating student:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
  // DELETE /api/students/:id (Admin only)
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const existingStudent = await Student.findById(id);
      if (!existingStudent) {
        return res.status(404).json({
          error: 'Student not found'
        });
      }
      await Student.delete(id);
      res.json({
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      res.status(500).json({
        error: 'Internal server error'
      });
    }
  }
}
module.exports = StudentController;