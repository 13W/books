const Joi = require('koa-joi-router').Joi;
const {DatabaseId} = require('./defaults');

exports.requestListQuery = Joi.object({
  limit: Joi.number()
    .min(1)
    .max(100)
    .optional()
    .description('number of returned objects'),
  offset: Joi.number()
    .min(1)
    .positive()
    .optional()
    .description('offset')
});

exports.requestGetByIdParams = Joi.object({
  id: DatabaseId
});
