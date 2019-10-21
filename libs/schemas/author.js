const Joi = require('koa-joi-router').Joi;
const {DatabaseId, Label} = require('./defaults');

module.exports = Joi.object({
  id: DatabaseId.optional(),
  name: Label.min(2).max(255)
    .description('Author`s name')
});
