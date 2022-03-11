const { celebrate, Joi } = require('celebrate');

const { validationUrlExpression } = require('../utils/validateLink');

const validateUpdateUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),
});
const validateNewUser = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
});
const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const validateDeletedMovie = celebrate({
  params: Joi.object().keys({
    id: Joi.string().length(24).required().hex()
      .messages({ 'string.alphanum': 'Некорректный id' }),
  }),
});

const validateNewMovie = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(validationUrlExpression).messages({ 'string.pattern.base': 'URL в поле "изображение" невалидный' }),
    trailerLink: Joi.string().required().pattern(validationUrlExpression).messages({ 'string.pattern.base': 'URL в поле "трейлер" невалидный' }),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().pattern(validationUrlExpression).messages({ 'string.pattern.base': 'URL в поле "мини-изображение" невалидный' }),
    movieId: Joi.number().required(),
  }),
});

module.exports = {
  validateUpdateUser,
  validateNewUser,
  validateLogin,
  validateDeletedMovie,
  validateNewMovie,
};
