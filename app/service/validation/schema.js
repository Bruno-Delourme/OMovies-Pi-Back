const Joi = require('joi');

const schemaCreateUser = Joi.object({
  pseudo: Joi.string().required(),
  email: Joi.string().email().required(),
  date_of_birth: Joi.date().required(),
  password: Joi.string().required(),
}).length(4).required();

const schemaLoginUser = Joi.object({
  pseudo: Joi.string().required(),
  password: Joi.string().required()
}).length(2).required();

const schemaUpdateUser = Joi.object({
  id: Joi.number().required(),
  pseudo: Joi.string(),
  email: Joi.string().email(),
  date_of_birth: Joi.date(),
  password: Joi.string(),
}).min(1).required();

const schemaFindUser = Joi.object({
  pseudo: Joi.string().required()
}).length(1).required();

module.exports = {
  schemaCreateUser, 
  schemaLoginUser, 
  schemaUpdateUser,
  schemaFindUser
};