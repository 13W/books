const Joi = require('koa-joi-router').Joi;
const {DatabaseId, Label} = require('./defaults');

module.exports = Joi.object({
  id: DatabaseId.optional(),
  title: Label
    .min(1)
    .max(255)
    .description('Book title'),
  date: Joi.date(),
  author: DatabaseId.required(),
  description: Joi.string()
    .optional()
    .description('Book description'),
  image_url: Joi.string().uri()
    .description('Book image')
});
