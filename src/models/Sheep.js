const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class Sheep {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.name = data.name;
    this.age = data.age || 0;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by;
    this.modified_by = data.modified_by;
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await query(
      'SELECT * FROM sheeps ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT * FROM sheeps WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByName(name) {
    const result = await query(
      'SELECT * FROM sheeps WHERE name ILIKE $1',
      [`%${name}%`]
    );
    return result.rows;
  }

  async save() {
    const result = await query(
      `INSERT INTO sheeps (id, name, age, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [this.id, this.name, this.age, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.name) {
      updateFields.push(`name = $${paramCount++}`);
      values.push(data.name);
    }
    if (data.age !== undefined) {
      updateFields.push(`age = $${paramCount++}`);
      values.push(data.age);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE sheeps SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM sheeps WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count() {
    const result = await query('SELECT COUNT(*) FROM sheeps');
    return parseInt(result.rows[0].count);
  }
}

module.exports = Sheep;