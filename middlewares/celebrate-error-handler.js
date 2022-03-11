const { isCelebrateError } = require('celebrate');
const BadRequestError = require('../errors/bad-request-error');

const celebrateErrorHandler = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    let error;
    if (err.details.get('params')) { error = err.details.get('params'); }
    if (err.details.get('body')) { error = err.details.get('body'); }
    if (err.details.get('headers')) { error = err.details.get('headers'); }
    const { message } = error.details[0];
    const errorNext = new BadRequestError(message);
    return next(errorNext);
  }
  return next(err);
};

module.exports = celebrateErrorHandler;
