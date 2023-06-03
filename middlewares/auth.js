const jwt = require('jsonwebtoken');
const AuthorizedError = require('../errors/auth-err');
const { AUTHORIZED_ERROR_MESSAGE, UNAUTHORIZED_ERROR_MESSAGE } = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  if (!req.cookies.jwt) {
    return next(new AuthorizedError(AUTHORIZED_ERROR_MESSAGE));
  }
  const token = req.cookies.jwt;
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    return next(new AuthorizedError(UNAUTHORIZED_ERROR_MESSAGE));
  }

  req.user = payload;

  return next();
};