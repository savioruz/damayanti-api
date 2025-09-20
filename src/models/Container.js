const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Container {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.code = data.code;
    this.location = data.location;
    this.user_id = data.user_id;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by;
    this.modified_by = data.modified_by;
  }

  static async findAll(limit = 50, offset = 0, user_id = null) {
    let queryText = `
      SELECT c.*, u.full_name as user_name 
      FROM containers c 
      LEFT JOIN users u ON c.user_id = u.id
    `;
    let params = [];
    let paramCount = 1;

    if (user_id) {
      queryText += ` WHERE c.user_id = $${paramCount++}`;
      params.push(user_id);
    }

    queryText += ` ORDER BY c.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT c.*, u.full_name as user_name 
       FROM containers c 
       LEFT JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  static async findByCode(code) {
    const result = await query(
      'SELECT * FROM containers WHERE code = $1',
      [code]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO containers (id, code, location, user_id, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [this.id, this.code, this.location, this.user_id, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.code) {
      updateFields.push(`code = $${paramCount++}`);
      values.push(data.code);
    }
    if (data.location) {
      updateFields.push(`location = $${paramCount++}`);
      values.push(data.location);
    }
    if (data.user_id) {
      updateFields.push(`user_id = $${paramCount++}`);
      values.push(data.user_id);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = CURRENT_TIMESTAMP`);

    values.push(id);

    const result = await query(
      `UPDATE containers SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM containers WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count(user_id = null) {
    let queryText = 'SELECT COUNT(*) FROM containers';
    let params = [];

    if (user_id) {
      queryText += ' WHERE user_id = $1';
      params.push(user_id);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Container;