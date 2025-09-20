const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Report {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.user_id = data.user_id;
    this.container_id = data.container_id;
    this.notes = data.notes;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by;
    this.modified_by = data.modified_by;
  }

  static async findAll(limit = 50, offset = 0, filters = {}) {
    let queryText = `
      SELECT r.*, c.code as container_code, c.location as container_location, u.full_name as user_name 
      FROM reports r 
      LEFT JOIN containers c ON r.container_id = c.id
      LEFT JOIN users u ON r.user_id = u.id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 1;

    if (filters.user_id) {
      queryText += ` AND r.user_id = $${paramCount++}`;
      params.push(filters.user_id);
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
      `SELECT r.*, c.code as container_code, c.location as container_location, u.full_name as user_name 
       FROM reports r 
       LEFT JOIN containers c ON r.container_id = c.id
       LEFT JOIN users u ON r.user_id = u.id 
       WHERE r.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO reports (id, user_id, container_id, notes, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [this.id, this.user_id, this.container_id, this.notes, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.user_id) {
      updateFields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }
    if (data.container_id) {
      updateFields.push(`container_id = $${paramCount++}`);
      values.push(data.container_id);
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
       RETURNING *`,
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

    if (filters.user_id) {
      queryText += ` AND user_id = $${paramCount++}`;
      params.push(filters.user_id);
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