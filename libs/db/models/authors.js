const Database = require('../database');

class Authors extends Database {
  async list(filters = {}) {
    const [where, props] = this.createFilter(filters);
    const query = `SELECT id, name
      FROM authors
      ${where}
    `;

    return await this.db.query(query, props);
  }

  async insert(object) {
    const fields = [];
    const values = [];
    for (const field of Object.keys(object)) {
      fields.push(field);
      values.push(`:${field}`);
    }

    const query = `INSERT INTO authors (${fields.join(', ')}) VALUES (${values.join(', ')})`;
    return await this.db.query(query, object);
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
    return await this.db.query(query, object);
  }

  async delete(id) {
    const query = 'DELETE FROM authors WHERE id = :id';
    return await this.db.query(query, {id});
  }
}

module.exports = new Authors();
