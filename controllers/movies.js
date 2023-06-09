const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');
const { OK, FORBIDDEN_ERROR_MESSAGE } = require('../utils/constants');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink,
    thumbnail, movieId, nameRU, nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      res.status(OK).send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const { _id } = req.params;
  Movie.findById({ _id })
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        movie.deleteOne()
          .then((deleteCard) => {
            res.send(deleteCard);
          })
          .catch(next);
      } else throw new ForbiddenError('Доступ запрещен');
    });
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
