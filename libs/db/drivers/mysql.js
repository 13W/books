const SQLDriver = require('./driver');

const mysql = require('mysql2/promise');

class MysqlDriver extends SQLDriver {
  async connect() {
    this.pool = await mysql.createPool(this.config);
  }

  async disconnect() {
    await this.pool.end();
  }

  async getConnection() {
    const conn = await this.pool.getConnection();
    conn.config.namedPlaceholders = true;
    return conn;
  }

  async query(sql, params) {
    const conn = await this.getConnection();
    return await conn.query(sql, params);
  }

  async update(sql, params) {
    return await this.query(sql, params);
  }
}

module.exports = MysqlDriver;
