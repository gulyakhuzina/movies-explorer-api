const express = require('express');
const { celebrate, Joi } = require('celebrate');

const movieRoute = express.Router();
const {
  getMovies, createMovie, deleteMovie,
} = require('../controllers/movies');

movieRoute.get('/', getMovies);
movieRoute.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required(),
    trailerLink: Joi.string().required(),
    thumbnail: Joi.string().required(),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);
movieRoute.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().required().hex(),
  }),
}), deleteMovie);

module.exports = movieRoute;