const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');
const { hashPassword } = require('../utils/auth');
const { USER_ROLES } = require('../constants/roles');

class User {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.email = data.email;
    this.password = data.password;
    this.full_name = data.full_name;
    this.role = data.role !== undefined ? data.role : USER_ROLES.USER;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by || this.id;
    this.modified_by = data.modified_by || this.id;
  }

  static async findAll(limit = 50, offset = 0) {
    const result = await query(
      'SELECT id, email, full_name, role, created_at, modified_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      'SELECT id, email, full_name, role, created_at, modified_at FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  static async findByEmail(email) {
    const result = await query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result.rows[0];
  }

  async save() {
    const hashedPassword = await hashPassword(this.password);
    const result = await query(
      `INSERT INTO users (id, email, password, full_name, role, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, email, full_name, role, created_at, modified_at`,
      [this.id, this.email, hashedPassword, this.full_name, this.role, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.email) {
      updateFields.push(`email = $${paramCount++}`);
      values.push(data.email);
    }
    if (data.full_name) {
      updateFields.push(`full_name = $${paramCount++}`);
      values.push(data.full_name);
    }
    if (data.password) {
      const hashedPassword = await hashPassword(data.password);
      updateFields.push(`password = $${paramCount++}`);
      values.push(hashedPassword);
    }
    if (data.role !== undefined) {
      updateFields.push(`role = $${paramCount++}`);
      values.push(data.role);
    }

    updateFields.push(`modified_by = $${paramCount++}`);
    values.push(modified_by);
    updateFields.push(`modified_at = NOW()`);

    values.push(id);

    const result = await query(
      `UPDATE users SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING id, email, full_name, role, created_at, modified_at`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM users WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count() {
    const result = await query('SELECT COUNT(*) FROM users');
    return parseInt(result.rows[0].count);
  }

  static async findByRole(role, limit = 50, offset = 0) {
    const result = await query(
      'SELECT id, email, full_name, role, created_at, modified_at FROM users WHERE role = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
      [role, limit, offset]
    );
    return result.rows;
  }

  static async countByRole(role) {
    const result = await query('SELECT COUNT(*) FROM users WHERE role = $1', [role]);
    return parseInt(result.rows[0].count);
  }

  // Check if user is admin
  isAdmin() {
    return this.role === USER_ROLES.ADMIN;
  }

  // Check if user is regular user
  isUser() {
    return this.role === USER_ROLES.USER;
  }
}

module.exports = User;