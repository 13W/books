/* eslint-disable require-atomic-updates */
const joiRouter = require('koa-joi-router');
const {Joi} = joiRouter;
const router = joiRouter();

const {schemaBook, schemaRequest: {requestListQuery, requestGetByIdParams}} = require('../schemas');

router.prefix('/books');

router.route({
  method: 'GET',
  path: '/',
  validate: {
    query: requestListQuery.concat(schemaBook)
      .optionalKeys('author')
      .options({
        allowUnknown: false,
        abortEarly: false
      }),
    output: {
      '200': {body: Joi.array().items(
        schemaBook.keys({
          author: Joi.string()
        }))
      }
    },
    failure: 400
  },
  async handler(ctx) {
    const {db, query} = ctx;

    ctx.body = await db.books.list(query);
  }
});

router.route({
  method: 'GET',
  path: '/:id',
  validate: {
    params: requestGetByIdParams,
    output: {
      200: {body: schemaBook.keys({author: Joi.string()})}
    },
    failure: 400
  },
  async handler(ctx) {
    const {db, params: {id}} = ctx;
    ctx.body = await db.books.get(id);
  }
});

router.route({
  method: 'PUT',
  path: '/',
  validate: {
    type: 'json',
    body: schemaBook.without('id', ['id']).options({
      allowUnknown: false
    })
  },
  async handler(ctx) {
    const {db, request: {body}} = ctx;

    const result = await db.books.insert(body);
    ctx.body = await db.books.get(result.insertId);
  }
});

router.route({
  method: 'POST',
  path: '/',
  validate: {
    type: 'json',
    body: schemaBook
      .requiredKeys('id')
      .optionalKeys('author')
      .options({allowUnknown: false})
  },
  async handler(ctx) {
    const {db, request: {body}} = ctx;

    await db.books.update(body);
    ctx.body = await db.books.get(body.id);
  }
});

router.route({
  method: 'DELETE',
  path: '/:id',
  validate: {
    params: requestGetByIdParams
  },
  async handler(ctx) {
    const {db, params: {id}} = ctx;
    ctx.body = await db.books.delete(id);
  }
});

module.exports = router;
