const { default: mongoose } = require('mongoose');

const {
  DocumentNotFoundError, CastError, ValidationError,
} = mongoose.Error;
const {
  ERROR_BAD_REQUEST,
  ERROR_NOT_FOUND,
  ERROR_SERVER,
  ERROR_BAD_REQUEST_MESSAGE,
  ERROR_SERVER_MESSAGE,
  ERROR_NOT_FOUND_MESSAGE,
} = require('../utils/constants');

const handleErrors = (err, req, res, next) => {
  if (err instanceof DocumentNotFoundError) {
    res.status(ERROR_NOT_FOUND).send({ message: ERROR_NOT_FOUND_MESSAGE });
  } else if (err instanceof CastError) {
    res.status(ERROR_BAD_REQUEST).send({ message: ERROR_BAD_REQUEST_MESSAGE + err.message });
  } else if (err instanceof ValidationError) {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join('; ');
    res.status(ERROR_BAD_REQUEST).send({ message });
  } else if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(ERROR_SERVER).send({ message: ERROR_SERVER_MESSAGE + err.message });
  }
  return next();
};

module.exports = handleErrors;
