/* eslint-disable no-unused-vars */

class SQLDriver {
  constructor(config) {
    if (!config) {
      this.throwError(new Error('config is not specified!'));
    }

    this.config = config;
    this.pool = null;
    this.conn = null;
  }

  throwError(error) {
    error.message = `Class '${this.constructor.name}': ${error.message}`;
    throw error;
  }

  async connect() {
    this.throwError(new Error('method \'connect\' is not implemented.'));
  }
  async disconnect() {
    this.throwError(new Error('method \'disconnect\' is not implemented.'));
  }

  async getConnection() {
    this.throwError(new Error('method \'getConnection\' is not implemented.'));
  }

  async query(sql, params) {
    this.throwError(new Error('method \'query\' is not implemented.'));
  }
}

module.exports = SQLDriver;
