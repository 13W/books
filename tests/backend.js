const config = require('../config/config');

const Koa = require('koa');
const app = new Koa();
const publicApiRouter = require('koa-joi-router')();
const server = app.listen();
const agent = require('supertest').agent(server);

const Database = require('../libs/db');
const routes = require('../libs/routes');

const assert = require('assert');
const timestamp = new Date().getTime();

let book = null;
let author = null;

before(function (done) {

  for (const router of Object.values(routes)) {
    publicApiRouter.use(router.middleware());
  }

  publicApiRouter.prefix(config.server.apiPath);
  app.use(publicApiRouter.middleware());

  (async () => {
    await Database.init(config.database);
    app.context.db = Database;
    done();
  })().catch((error) => {
    console.error(error);
    done(error);
  });
});

after(function () {
  Database.disconnect().then(() => server.close());
});

describe('Backend test', function () {
  describe('authors endpoint', function () {
    const authorName = `test author ${timestamp}`;

    it('create author', async () => await agent
      .put(`${config.server.apiPath}/authors`)
      .set('Content-type', 'application/json')
      .send({name: authorName})
      .expect(200)
      .then((res) => author = res.body)
    );

    it('update author', async () => await agent
      .post(`${config.server.apiPath}/authors`)
      .set('Content-type', 'application/json')
      .send({...author, name: `new ${authorName}`})
      .expect(200)
      .then((res) => {
        assert(res.body.name === `new ${authorName}`);
        author = res.body;
      })
    );

    it('filter by id', async () => await agent
      .get(`${config.server.apiPath}/authors?id=${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('filter by name', async () => await agent
      .get(`${config.server.apiPath}/authors?name=${author.name}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [author]))
    );

    it('get by id', async () => await agent
      .get(`${config.server.apiPath}/authors/${author.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, author))
    );
  });

  describe('books endpoint', function () {
    this.timeout(30000);
    const bookTitle = `test book ${timestamp}`;

    it('create book', async () => await agent
      .put(`${config.server.apiPath}/books`)
      .set('Content-type', 'application/json')
      .send({
        title: bookTitle,
        date: new Date(),
        author: author.id,
        description: 'test book description',
        image_url: 'http://localhost/image.gif'
      })
      .expect(200)
      .then((res) => book = res.body)
    );

    it('update book', async () => await agent
      .post(`${config.server.apiPath}/books`)
      .set('Content-type', 'application/json')
      .send({...book, author: undefined, title: `new ${bookTitle}`})
      .expect(200)
      .then((res) => {
        assert(res.body.title === `new ${bookTitle}`);
        book = res.body;
      })
    );

    it('filter books by id', async () => await agent
      .get(`${config.server.apiPath}/books?id=${book.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [book]))
    );

    it('filter books by title', async () => await agent
      .get(`${config.server.apiPath}/books?title=${book.title}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, [book]))
    );

    it('get book by id', async () => await agent
      .get(`${config.server.apiPath}/books/${book.id}`)
      .expect(200)
      .then(({body}) => assert.deepEqual(body, book))
    );
  });

  describe('cleanup', function () {
    it('delete book', async () => await agent
      .del(`${config.server.apiPath}/books/${book.id}`)
      .expect(200)
    );

    it('delete author', async () => await agent
      .del(`${config.server.apiPath}/authors/${author.id}`)
      .expect(200)
    );

    it('get deleted book by id', async () => await agent
      .get(`${config.server.apiPath}/books/${book.id}`)
      .expect(204)
    );

    it('get deleted author by id', async () => await agent
      .get(`${config.server.apiPath}/authors/${author.id}`)
      .expect(204)
    );
  });
});
