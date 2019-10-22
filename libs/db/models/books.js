const Database = require('../database');

class Books extends Database {
  async list(filters = {}) {
    for (let [property, value] of Object.entries(filters)) {
      if (['order', 'offset', 'limit'].includes(property)) {
        continue;
      }

      if (property === 'date') {
        const year = value.getFullYear();
        const month = (value.getMonth() + 1).toString().padStart(2, '0');
        const date = value.getDate().toString().padStart(2, '0');
        value = `${year}-${month}-${date}`;
      }

      if (property === 'author') {
        if (typeof value === 'number') {
          filters['a.id'] = value;
        } else {
          filters['a.name'] = value;
        }
      } else {
        filters[`b.${property}`] = value;
      }

      delete filters[property];
    }

    const [where, props] = this.createFilter(filters);
    const query = `SELECT
      b.id,
      b.title AS title,
      b.date AS date,
      a.name AS author,
      b.description AS description,
      b.image_url AS image_url
      FROM books AS b
      JOIN authors AS a ON b.author = a.id
      ${where}
    `;

    const [result] = await this.db.query(query, props);
    return result;
  }

  async get(id) {
    const query = `SELECT
      b.id AS id,
      b.title AS title,
      b.date AS date,
      a.name AS author,
      b.description AS description,
      b.image_url AS image_url
      FROM books AS b
      JOIN authors AS a ON b.author = a.id
      WHERE b.id = :id
    `;

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

    const query = `INSERT INTO books (${fields.join(', ')}) VALUES (${values.join(', ')})`;
    const [result] = await this.db.query(query, object);
    return result;
  }

  async update(object = null) {
    if (!object.hasOwnProperty('id')) {
      return this.throwError(new Error(''));
    }
    const sets = [];
    for (const field of Object.keys(object)) {
      if (field === 'id') {
        continue;
      }

      sets.push(`${field} = :${field}`);
    }

    const query = `UPDATE books SET ${sets.join(', ')} WHERE id = :id`;
    const [result] = await this.db.query(query, object);
    return result;
  }

  async delete(id) {
    const query = 'DELETE FROM books WHERE id = :id';
    const [result] = await this.db.query(query, {id});
    return result;
  }
}

module.exports = new Books();
