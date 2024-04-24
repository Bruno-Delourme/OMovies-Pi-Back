const Joi = require('joi');

const schemaCreateUser = Joi.object({
  pseudo: Joi.string().required(),
  email: Joi.string().email().required(),
  birthday: Joi.date().required(),
  password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$')).required()
  .messages({
    'string.pattern.base': 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
  }),
}).length(4).required();

const schemaLoginUser = Joi.object({
  pseudo: Joi.string().required(),
  password: Joi.string().required()
}).length(2).required();

const schemaUpdateUser = Joi.object({
  id: Joi.number().required(),
  pseudo: Joi.string(),
  email: Joi.string().email(),
  birthday: Joi.date(),
  password: Joi.string().pattern(new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-+]).{8,}$')).required()
  .messages({
    'string.pattern.base': 'Le mot de passe doit comporter au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.'
  }),
  token: Joi.string().required(),
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