const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { OK, CONFLICT_ERROR_MESSAGE, COOKIES_DELETED } = require('../utils/constants');
const ConflictError = require('../errors/conflict-err');

const { NODE_ENV, JWT_SECRET } = process.env;

function findById(req, res, next, userId) {
  User.findById(userId)
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch(next);
}

function updateInfo(req, res, next, info) {
  User.findByIdAndUpdate(req.user._id, info, { new: true, runValidators: true })
    .orFail()
    .then((user) => {
      res.send(user);
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      }
      return next(error);
    });
}

const createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    }))
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000, // 1 час
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      res.status(OK).send({
        token,
        name: user.name,
        email: user.email,
        id: user._id,
      });
    })
    .catch((error) => {
      if (error.code === 11000) {
        return next(new ConflictError(CONFLICT_ERROR_MESSAGE));
      }
      return next(error);
    });
};

const updateProfile = (req, res, next) => {
  const { name, email } = req.body;
  updateInfo(req, res, next, { name, email });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key',
        { expiresIn: '7d' },
      );
      res
        .cookie('jwt', token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: 'none',
          secure: true,
        });
      res.send({ token });
    })
    .catch(next);
};

const deleteCookie = (req, res) => {
  res.clearCookie('jwt', {
    maxAge: 3600000,
    httpOnly: true,
    sameSite: 'none',
    secure: true,
  });
  res.send(COOKIES_DELETED);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  findById(req, res, next, userId);
};

module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  deleteCookie,
};