const config = require('../config/config');
const mysql = require('mysql2/promise');

const authorsCounts = 100;
const booksCounts = 1e5;

(async () => {
  const pool = await mysql.createPool(config.database.mysql);

  const createInsert = async (table = '', fields = [], records = [[]]) => {
    let query = `INSERT INTO \`${table}\` (${fields.join(', ')}) VALUES `;
    const values = [];
    let count = 0;
    do {
      const chunk = records.splice(0, 20000);
      for (const record of chunk) {
        values.push(`"${record.join('", "')}"`);
      }
      count += values.length;
      const conn = await pool.getConnection();
      await conn.query(`${query} (${values.splice(0).join('), (')});\n`, []);
      console.log(`Created ${count} records in ${table}...`);
    } while (records.length > 0);
  };

  let authors = [];
  let authorsHash = {};
  for (let i = 1; i <= authorsCounts; i += 1) {
    const authorName = authorsHash[i] = `Test Author${i}`;
    authors.push([i, authorName]);
  }

  await createInsert('authors', ['id', 'name'], authors);

  let books = [];
  for (let i = 1; i <= booksCounts; i += 1) {
    const authorId = Math.ceil(Math.random() * authorsCounts);
    const year = Math.ceil(Math.random() * 200 + 1810);
    const month = (Math.floor(Math.random() * 12)).toString().padStart(2, '0');
    const date = Math.ceil(Math.random() * 30).toString().padStart(2, '0');
    const fullDate = `${year}-${month}-${date}`;

    books.push([i, `book's title ${i}`, fullDate, authorId,
      `The book was written in ${fullDate} by ${authorsHash[authorId]}`,
      `http://${config.server.address}:${config.server.port}/book/${i}/image.jpg`
    ]);
  }

  await createInsert('books',
    ['id', 'title', 'date', 'author', 'description', 'image_url'],
    books
  );

  pool.end();
})().catch((error) => console.error(error));
