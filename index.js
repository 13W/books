const config = require('./config/config');

const Koa = require('koa');
const logger = require('koa-bunyan-logger');
const Database = require('./libs/db');
const routes = require('./libs/routes');

const app = new Koa();
const publicApiRouter = require('koa-joi-router')();

const server = app.listen(config.server.port, config.server.address);

app.use(logger());
app.use(logger.requestIdContext());
app.use(logger.requestLogger());

app.use(async (ctx, next) => {
  if (!ctx.db) {
    return await next(new Error('Awaiting database connection... please try again later.'));
  }

  return await next();
});

for (const route of routes) {
  publicApiRouter.use(route);
}

publicApiRouter.prefix(config.server.apiPath);
app.use(publicApiRouter.middleware());

(async () => {
  console.log('initializing database...');
  await Database.init(config.database);

  app.context.db = Database;
  console.log('initialization complete.');
})().catch((error) => {
  console.error(error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('Terminating...');
  Database.disconnect()
    .then(() => {
      server.close();
    })
    .catch((error) => console.error(error));
});

exports.server = server;
exports.app = app;
