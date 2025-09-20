const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class SheepReport {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.sheep_id = data.sheep_id;
    this.feeding_time = data.feeding_time;
    this.status = data.status;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by;
    this.modified_by = data.modified_by;
  }

  static async findAll(limit = 50, offset = 0, filters = {}) {
    let queryText = `
      SELECT sr.*, s.name as sheep_name, s.age as sheep_age 
      FROM sheep_reports sr 
      LEFT JOIN sheeps s ON sr.sheep_id = s.id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 1;

    if (filters.sheep_id) {
      queryText += ` AND sr.sheep_id = $${paramCount++}`;
      params.push(filters.sheep_id);
    }
    if (filters.status) {
      queryText += ` AND sr.status = $${paramCount++}`;
      params.push(filters.status);
    }
    if (filters.date_from) {
      queryText += ` AND sr.feeding_time >= $${paramCount++}`;
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      queryText += ` AND sr.feeding_time <= $${paramCount++}`;
      params.push(filters.date_to);
    }

    queryText += ` ORDER BY sr.feeding_time DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT sr.*, s.name as sheep_name, s.age as sheep_age 
       FROM sheep_reports sr 
       LEFT JOIN sheeps s ON sr.sheep_id = s.id 
       WHERE sr.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO sheep_reports (id, sheep_id, feeding_time, status, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [this.id, this.sheep_id, this.feeding_time, this.status, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.sheep_id) {
      updateFields.push(`sheep_id = $${paramCount++}`);
      values.push(data.sheep_id);
    }
    if (data.feeding_time) {
      updateFields.push(`feeding_time = $${paramCount++}`);
      values.push(data.feeding_time);
    }
    if (data.status) {
      updateFields.push(`status = $${paramCount++}`);
      values.push(data.status);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE sheep_reports SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM sheep_reports WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count(filters = {}) {
    let queryText = 'SELECT COUNT(*) FROM sheep_reports WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (filters.sheep_id) {
      queryText += ` AND sheep_id = $${paramCount++}`;
      params.push(filters.sheep_id);
    }
    if (filters.status) {
      queryText += ` AND status = $${paramCount++}`;
      params.push(filters.status);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }

  static async getRecentByStatus(status, limit = 10) {
    const result = await query(
      `SELECT sr.*, s.name as sheep_name 
       FROM sheep_reports sr 
       LEFT JOIN sheeps s ON sr.sheep_id = s.id 
       WHERE sr.status = $1 
       ORDER BY sr.feeding_time DESC 
       LIMIT $2`,
      [status, limit]
    );
    return result.rows;
  }
}

module.exports = SheepReport;