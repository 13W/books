const joiRouter = require('koa-joi-router');
const {Joi} = joiRouter;
const router = joiRouter();

const {schemaAuthor, schemaRequest: {requestListQuery, requestGetByIdParams}} = require('../schemas');

router.prefix('/authors');

router.route({
  method: 'GET',
  path: '/',
  validate: {
    query: requestListQuery.concat(schemaAuthor),
    output: {
      '200': {body: Joi.array().items(schemaAuthor)}
    },
    failure: 400
  },
  async handler(ctx) {
    const {db, query} = ctx;

    [ctx.body] = await db.authors.list(query);
  }
});

router.route({
  method: 'GET',
  path: '/:id',
  validate: {
    params: requestGetByIdParams,
    output: {
      200: {body: schemaAuthor}
    },
    failure: 400
  },
  async handler(ctx) {
    const {db, params: {id}} = ctx;
    [[ctx.body]] = await db.authors.list({id}, {limit: 1});
  }
});

router.route({
  method: 'PUT',
  path: '/',
  validate: {
    type: 'json',
    body: schemaAuthor.without('id', ['id']).options({
      allowUnknown: false
    })
  },
  async handler(ctx) {
    const {db, request: {body}} = ctx;

    const [result] = await db.authors.insert(body);
    [[ctx.body]] = await db.authors.list({id: result.insertId}, {limit: 1});
  }
});

router.route({
  method: 'POST',
  path: '/',
  validate: {
    type: 'json',
    body: schemaAuthor
      .requiredKeys('id')
      .options({allowUnknown: false})
  },
  async handler(ctx) {
    const {db, request: {body}} = ctx;

    await db.authors.update(body);
    [[ctx.body]] = await db.authors.list({id: body.id}, {limit: 1});
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
    [ctx.body] = await db.authors.delete(id);
  }
});

module.exports = router.middleware();
