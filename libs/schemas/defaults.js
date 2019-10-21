const Joi = require('koa-joi-router').Joi;

exports.DatabaseId = Joi.number()
  .min(1)
  .max(Number.MAX_SAFE_INTEGER)
  .optional()
  .description('Entry index in the database');

exports.Label = Joi.string().regex(/^[a-z0-9' ]+$/i);
