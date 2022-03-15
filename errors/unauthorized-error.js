const { UNAUTHORIZED_ERROR } = require('../utils/constants');

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedError';
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}
module.exports = UnauthorizedError;
