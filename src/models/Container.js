const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Container {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.code = data.code;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by || this.id;
    this.modified_by = data.modified_by || this.id;
  }

  static async findAll(limit = 10, offset = 0) {
    const result = await query(
      'SELECT id, code, created_at, modified_at FROM containers ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, code, created_at, modified_at FROM containers WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByCode(code) {
    const result = await query(
      'SELECT id, code, created_at, modified_at FROM containers WHERE code = $1',
      [code]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO containers (id, code, created_by, modified_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, code, created_at, modified_at`,
      [this.id, this.code, this.created_by, this.modified_by]
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

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE containers SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, code, created_at, modified_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM containers WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count() {
    const result = await query('SELECT COUNT(*) FROM containers');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Container;