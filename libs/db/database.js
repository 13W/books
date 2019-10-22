let driver = null;

class Database {
  get db() {
    return driver;
  }

  /**
   * Initialize Database instance
   * @param {Object} config database configuration options
   * @returns {Database} Database instance
   */
  static async init(config) {
    const database = new Database();
    if (!database.db && config) {
      driver = require('./drivers')(config);
    }

    await database.db.connect();

    return database;
  }

  static async disconnect() {
    if (!driver) {
      return;
    }

    return await driver.disconnect();
  }

  createFilter(properties) {
    let filter = '';
    const filters = [];
    let order = '';
    const props = {};
    let index = 1;

    for (const [property, value] of Object.entries(properties)) {
      if (property === 'limit' || property === 'offset') {
        continue;
      }
      const field = `field_${index++}`;
      props[field] = value;

      if (property === 'order') {
        order = `ORDER BY :${field} `;
        continue;
      }

      filters.push(`${property} = :${field}`);
    }
    props.limit = properties.limit || 100;
    props.offset = properties.offset || 0;

    if (filters.length) {
      filter += `WHERE ${filters.join(' AND ')} `;
    }

    if (order.length) {
      filter += order;
    }

    filter += 'LIMIT :offset, :limit';

    return [filter, props];
  }

  async list() {
    this.db.throwError(new Error('`list` is not implemented yet.'));
  }

  async get() {
    this.db.throwError(new Error('`list` is not implemented yet.'));
  }
}

module.exports = Database;
