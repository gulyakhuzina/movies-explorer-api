const Movie = require('../models/movie');
const ForbiddenError = require('../errors/forbidden-err');

const OK = 201;

const getMovies = (req, res, next) => {
  Movie.find()
    .populate(['owner'])
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
    .then((movie) => movie.populate(['owner']))
    .then((movie) => {
      res.status(OK).send(movie);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  // const { cardId } = req.params;
  const { _id } = req.params;
  Movie.findById(_id)
    .orFail()
    .populate(['owner'])
    .then((movie) => {
      if (movie.owner._id.toString() === req.user._id) {
        movie.deleteOne()
          .then((delMovie) => {
            res.send(delMovie);
          })
          .catch(next);
      } else throw new ForbiddenError('Доступ запрещен');
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};