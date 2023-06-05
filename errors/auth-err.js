const { UNAUTHORIZED_ERROR } = require('../utils/constants');

class AuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = UNAUTHORIZED_ERROR;
  }
}

module.exports = AuthorizedError;