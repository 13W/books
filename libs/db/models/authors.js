const Database = require('../database');

class Authors extends Database {
  async list(filters = {}) {
    const [where, props] = this.createFilter(filters);
    const query = `SELECT id, name
      FROM authors
      ${where}
    `;

    const [result] = await this.db.query(query, props);
    return result;
  }

  async get(id) {
    const query = 'SELECT id, name FROM authors WHERE id = :id';
    const [[result]] = await this.db.query(query, {id});
    return result;
  }

  async insert(object) {
    const fields = [];
    const values = [];
    for (const field of Object.keys(object)) {
      fields.push(field);
      values.push(`:${field}`);
    }

    const query = `INSERT INTO authors (${fields.join(', ')}) VALUES (${values.join(', ')})`;
    const [result] = await this.db.query(query, object);
    return result;
  }

  async update(object = null) {
    const sets = [];
    for (const field of Object.keys(object)) {
      if (field === 'id') {
        continue;
      }

      sets.push(`${field} = :${field}`);
    }

    const query = `UPDATE authors SET ${sets.join(', ')} WHERE id = :id`;
    const [result] = await this.db.query(query, object);
    return result;
  }

  async delete(id) {
    const query = 'DELETE FROM authors WHERE id = :id';
    const [result] = await this.db.query(query, {id});
    return result;
  }
}

module.exports = new Authors();
