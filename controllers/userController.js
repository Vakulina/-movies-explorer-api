const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request-error');
const NotFoundError = require('../errors/not-found-error');
const UnauthorizedError = require('../errors/unauthorized-error');
const ConflictError = require('../errors/conflict-error');
const { SECRET_KEY } = require('../utils/config');
const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.postUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      email, password: hash, name,
    })
      .then((user) => res.status(201).send({ data: user }))
      .catch((err) => {
        switch (err.name) {
          case 'CastError':
            next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
            break;
          case 'ValidationError':
            next(new BadRequestError(`${Object.values(err.errors).map((error) => error.message).join(', ')}`));
            break;
          case 'MongoServerError':
            if (err.code === 11000) {
              next(new ConflictError('Данный пользователь уже зарегистрирован!'));
            }
            break;
          default:
            next(err);
        }
      }))
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  User.findOne({ email }).select('+password')
    .orFail(() => new UnauthorizedError('Неправильные почта или пароль'))
    .then((user) => {
      bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            // хеши не совпали — отклоняем промис
            return Promise.reject(new UnauthorizedError('Неправильные почта или пароль'));
          }
          return user;
        })
        .then(() => {
          const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : SECRET_KEY, { expiresIn: '7d' });
          // вернём токен
          res.cookie('jwt', token, { maxAge: 3600000 * 24 * 7, httpOnly: true, sameSite: true })
            .send({ token });
        })
        .catch(() => {
          next(new UnauthorizedError('Неправильные почта или пароль'));
        });
    })
    .catch(next);
};

module.exports.logout = (req, res, next) => {
  res.clearCookie('jwt', {
    // secure: true,
    sameSite: true,
  })
    .status(200)
    .send({ message: 'Успешный выход из системы' })
    .catch(next);
};
module.exports.getUser = (req, res, next) => {
  User.findOne({ _id: req.user._id })
    .orFail(new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ email: user.email, name: user.name }))
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(userId, { name, email }, { runValidators: true, new: true })
    .orFail(() => new NotFoundError('Пользователь не найден'))
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Пользователь с данным email уже существует'));
      } else { next(err); }
    });
};
