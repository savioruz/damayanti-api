const { query } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class SensorData {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.container_id = data.container_id;
    this.temperature = data.temperature;
    this.humidity = data.humidity;
    this.gas = data.gas;
    this.ph = data.ph;
    this.status = data.status;
    this.created_at = data.created_at;
    this.modified_at = data.modified_at;
    this.created_by = data.created_by || this.id;
    this.modified_by = data.modified_by || this.id;
  }

  static async findAll(limit = 10, offset = 0, filters = {}) {
    let queryText = `
      SELECT sd.*, c.code as container_code
      FROM sensor_data sd 
      LEFT JOIN containers c ON sd.container_id = c.id
      WHERE 1=1
    `;
    let params = [];
    let paramCount = 1;

    if (filters.container_id) {
      queryText += ` AND sd.container_id = $${paramCount++}`;
      params.push(filters.container_id);
    }
    if (filters.date_from) {
      queryText += ` AND sd.created_at >= $${paramCount++}`;
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      queryText += ` AND sd.created_at <= $${paramCount++}`;
      params.push(filters.date_to);
    }

    queryText += ` ORDER BY sd.created_at DESC LIMIT $${paramCount++} OFFSET $${paramCount}`;
    params.push(limit, offset);

    const result = await query(queryText, params);
    return result.rows;
  }

  static async findById(id) {
    const result = await query(
      `SELECT sd.*, c.code as container_code
       FROM sensor_data sd 
       LEFT JOIN containers c ON sd.container_id = c.id
       WHERE sd.id = $1`,
      [id]
    );
    return result.rows[0];
  }

  async save() {
    const result = await query(
      `INSERT INTO sensor_data (id, container_id, temperature, humidity, gas, ph, status, created_by, modified_by)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, container_id, temperature, humidity, gas, ph, status, created_at, modified_at`,
      [this.id, this.container_id, this.temperature, this.humidity, this.gas, this.ph, this.status, this.created_by, this.modified_by]
    );
    return result.rows[0];
  }

  static async update(id, data, modified_by) {
    const updateFields = [];
    const values = [];
    let paramCount = 1;

    if (data.container_id) {
      updateFields.push(`container_id = $${paramCount++}`);
      values.push(data.container_id);
    }
    if (data.temperature !== undefined) {
      updateFields.push(`temperature = $${paramCount++}`);
      values.push(data.temperature);
    }
    if (data.humidity !== undefined) {
      updateFields.push(`humidity = $${paramCount++}`);
      values.push(data.humidity);
    }
    if (data.gas !== undefined) {
      updateFields.push(`gas = $${paramCount++}`);
      values.push(data.gas);
    }
    if (data.ph !== undefined) {
      updateFields.push(`ph = $${paramCount++}`);
      values.push(data.ph);
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
      `UPDATE sensor_data SET ${updateFields.join(', ')} WHERE id = $${paramCount} 
       RETURNING *`,
      values
    );
    return result.rows[0];
  }

  static async delete(id) {
    const result = await query('DELETE FROM sensor_data WHERE id = $1 RETURNING id', [id]);
    return result.rows[0];
  }

  static async count(filters = {}) {
    let queryText = 'SELECT COUNT(*) FROM sensor_data WHERE 1=1';
    let params = [];
    let paramCount = 1;

    if (filters.container_id) {
      queryText += ` AND container_id = $${paramCount++}`;
      params.push(filters.container_id);
    }
    if (filters.date_from) {
      queryText += ` AND created_at >= $${paramCount++}`;
      params.push(filters.date_from);
    }
    if (filters.date_to) {
      queryText += ` AND created_at <= $${paramCount++}`;
      params.push(filters.date_to);
    }

    const result = await query(queryText, params);
    return parseInt(result.rows[0].count);
  }

  static async getLatestByContainer(container_id) {
    const result = await query(
      `SELECT * FROM sensor_data WHERE container_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [container_id]
    );
    return result.rows[0];
  }
}

module.exports = SensorData;