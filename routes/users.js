const express = require('express');
const { celebrate, Joi } = require('celebrate');

const options = {
  errors: {
    wrap: {
      label: false,
    },
  },
};

const userRoute = express.Router();
const {
  updateProfile, getCurrentUser,
} = require('../controllers/users');

userRoute.get('/me', getCurrentUser);
userRoute.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string()
      .required()
      .min(2)
      .max(30)
      .messages({
        'string.min': 'Минимальная длина 2 символа',
        'string.max': 'Максимальная длина 30 символов',
      }),
    email: Joi.string().required().email().messages({
      'string.email': '{{#label}} должен быть корректным',
    }),
  }),
}, options), updateProfile);

module.exports = userRoute;