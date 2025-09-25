const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Report {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.student_id = data.student_id;
    this.container_id = data.container_id;
    this.sensor_data_id = data.sensor_data_id;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by || this.id;
    this.modified_by = data.modified_by || this.id;
  }

  static async findAll(limit = 10, offset = 0, filters = {}) {
    let queryText = `
      SELECT r.*, c.code as container_code, d.temperature, d.humidity, d.gas, d.ph, d.status, s.full_name as student_name 
      FROM reports r 
      LEFT JOIN containers c ON r.container_id = c.id
      LEFT JOIN sensor_data d ON r.sensor_data_id = d.id
      LEFT JOIN students s ON r.student_id = s.id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 1;

    if (filters.student_id) {
      queryText += ` AND r.student_id = $${paramCount++}`;
      params.push(filters.student_id);
    }
    if (filters.container_id) {
      queryText += ` AND r.container_id = $${paramCount++}`;
      params.push(filters.container_id);
    }

    queryText += ` ORDER BY r.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT r.*, c.code as container_code, s.full_name as student_name 
       FROM reports r 
       LEFT JOIN containers c ON r.container_id = c.id
       LEFT JOIN students s ON r.student_id = s.id 
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO reports (id, student_id, container_id, sensor_data_id, notes, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, student_id, container_id, sensor_data_id, notes, created_at, modified_at`,
      [this.id, this.student_id, this.container_id, this.sensor_data_id, this.notes, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.student_id) {
      updateFields.push(`student_id = $${paramCount++}`);
      values.push(data.student_id);
    }
    if (data.container_id) {
      updateFields.push(`container_id = $${paramCount++}`);
      values.push(data.container_id);
    }
    if (data.sensor_data_id) {
      updateFields.push(`sensor_data_id = $${paramCount++}`);
      values.push(data.sensor_data_id);
    }
    if (data.notes !== undefined) {
      updateFields.push(`notes = $${paramCount++}`);
      values.push(data.notes);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE reports SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, student_id, container_id, sensor_data_id, notes, created_at, modified_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM reports WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count(filters = {}) {
    let queryText = 'SELECT COUNT(*) FROM reports WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (filters.student_id) {
      queryText += ` AND student_id = $${paramCount++}`;
      params.push(filters.student_id);
    }
    if (filters.container_id) {
      queryText += ` AND container_id = $${paramCount++}`;
      params.push(filters.container_id);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Report;