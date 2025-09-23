const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Student {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.full_name = data.full_name;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by || this.id;
    this.modified_by = data.modified_by || this.id;
  }

  static async findAll(limit = 50, offset = 0, full_name = null) {
    let sql = 'SELECT id, full_name, created_at, modified_at FROM students';
    let params = [];
    let paramCount = 1;

    if (full_name) {
      sql += ' WHERE full_name ILIKE $' + paramCount++;
      params.push(`%${full_name}%`);
    }

    sql += ' ORDER BY created_at DESC LIMIT $' + paramCount++;
    params.push(limit);
    
    sql += ' OFFSET $' + paramCount;
    params.push(offset);

    const result = await query(sql, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, full_name, created_at, modified_at FROM students WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO students (id, full_name, created_by, modified_by)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name, created_at, modified_at`,
      [this.id, this.full_name, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.full_name) {
      updateFields.push(`full_name = $${paramCount++}`);
      values.push(data.full_name);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE students SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, full_name, created_at, modified_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM students WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count(full_name = null) {
    let sql = 'SELECT COUNT(*) FROM students';
    let params = [];

    if (full_name) {
      sql += ' WHERE full_name ILIKE $1';
      params.push(`%${full_name}%`);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count);
  }
}

module.exports = Student;