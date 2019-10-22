const config = require('./config/config');

const Koa = require('koa');
const logger = require('koa-bunyan-logger');
const koaDocs = require('koa-docs');
const Database = require('./libs/db');
const routes = require('./libs/routes');

const app = new Koa();
const publicApiRouter = require('koa-joi-router')();

const serverAddress = config.server.address || '127.0.0.1';
const serverPort = config.server.port || 8008;
const serverApiPath = config.server.apiPath || '/api';
const serverDocsPath = `${serverApiPath}/docs`;

const server = app.listen(serverPort, serverAddress);
console.log(`The server is running at http://${serverAddress}:${serverPort}${serverApiPath}`);

app.use(logger());
app.use(logger.requestIdContext());
app.use(logger.requestLogger());

app.use(async (ctx, next) => {
  if (!ctx.db) {
    return await next(new Error('Awaiting database connection... please try again later.'));
  }

  return await next();
});

for (const router of Object.values(routes)) {
  publicApiRouter.use(router.middleware());
}

app.use(koaDocs.get(serverDocsPath, {
  title: 'Books API',
  version: '1.0.0',

  theme: 'darkly',
  routeHandlers: 'disabled',  // Hide the route implementation code from docs
  groups: [
    { groupName: 'Authors', routes: routes.authors.routes },
    { groupName: 'Books', routes: routes.books.routes }
  ]
}));

publicApiRouter.prefix(serverApiPath);
publicApiRouter.get('/', async (ctx) => ctx.redirect(serverDocsPath));

app.use(publicApiRouter.middleware());
app.on('error', (error) => {
  console.error(error);
});

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
