const { INTERNAL_SERVER_ERROR } = require('../utils/constants');

const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || INTERNAL_SERVER_ERROR;
  const message = (statusCode === INTERNAL_SERVER_ERROR) ? 'Ошибка на сервере' : err.message;
  res.status(statusCode).send({ message });
  next();
};
module.exports = errorHandler;
