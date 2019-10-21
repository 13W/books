const config = require('../config/config').server;
const server = require('../index').server;
const agent = require('supertest').agent(server);

const assert = require('assert');
const timestamp = new Date().getTime();

let book = null;
let author = null;
describe('Backend test', function () {
  describe('authors endpoint', function () {
    const authorName = `test author ${timestamp}`;

    it('create author', async () => await agent
      .put(`${config.apiPath}/authors`)
      .set('Content-type', 'application/json')
      .send({name: authorName})
      .expect(200)
      .then((res) => author = res.body)
    );

    it('update author', async () => await agent
      .post(`${config.apiPath}/authors`)
      .set('Content-type', 'application/json')
      .send({...author, name: `new ${authorName}`})
      .expect(200)
      .then((res) => {
        assert(res.body.name === `new ${authorName}`);
        author = res.body;
      })
    );

    it('filter by id', async () => await agent
      .get(`${config.apiPath}/authors?id=${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('filter by name', async () => await agent
      .get(`${config.apiPath}/authors?name=${author.name}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('get by id', async () => await agent
      .get(`${config.apiPath}/authors/${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, author))
    );

    it('delete author', async () => await agent
      .del(`${config.apiPath}/authors/${author.id}`)
      .expect(200)
    );

    it('get deleted author by id', async () => await agent
      .get(`${config.apiPath}/authors/${author.id}`)
      .expect(204)
    );
  });

  describe('books endpoint', function () {
    const authorName = `test book ${timestamp}`;

    it('create book', async () => await agent
      .put(`${config.apiPath}/books`)
      .set('Content-type', 'application/json')
      .send({name: authorName})
      .expect(200)
      .then((res) => author = res.body)
    );

    it('update book', async () => await agent
      .post(`${config.apiPath}/books`)
      .set('Content-type', 'application/json')
      .send({...author, name: `new ${authorName}`})
      .expect(200)
      .then((res) => {
        assert(res.body.name === `new ${authorName}`);
        author = res.body;
      })
    );

    it('filter books by id', async () => await agent
      .get(`${config.apiPath}/books?id=${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('filter books by title', async () => await agent
      .get(`${config.apiPath}/authors?name=${author.name}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('get book by id', async () => await agent
      .get(`${config.apiPath}/authors/${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, author))
    );

    it('delete book', async () => await agent
      .del(`${config.apiPath}/authors/${author.id}`)
      .expect(200)
    );

    it('get deleted book by id', async () => await agent
      .get(`${config.apiPath}/authors/${author.id}`)
      .expect(204)
    );
  });
});

after(function () {
  process.emit('SIGTERM');
});
