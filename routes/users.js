const express = require('express');
const { celebrate, Joi } = require('celebrate');

const userRoute = express.Router();
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

userRoute.get('/me', getCurrentUser);
userRoute.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required(),
  }),
}), updateProfile);

module.exports = userRoute;