const Movie = require('../models/movie');
const NotFoundError = require('../errors/not-found-error');
const BadRequestError = require('../errors/bad-request-error');
const ForbiddenError = require('../errors/forbidden-error');
const ConflictError = require('../errors/conflict-error');

module.exports.getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .orFail(new NotFoundError('Фильмов не найдено'))
    .then((data) => res.send(data))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country, director, duration, year, description,
    image, trailerLink, nameRU, nameEN, thumbnail, movieId,
  } = req.body;
  Movie
    .create({
      country,
      director,
      duration,
      year,
      description,
      image,
      trailerLink,
      nameRU,
      nameEN,
      thumbnail,
      movieId,
      owner,
    })
    // вернём записанные в базу данные
    .then((movie) => res.status(200).send(movie))
    // данные не записались, вернём ошибку
    .catch((err) => {
      if (err.name === 'MongoServerError' && err.code === 11000) {
        next(new ConflictError('Данный фильм уже сохранен!'));
      }
      if ((err.errors) && (err.errors.link === 'ValidatorError')) {
        next(new BadRequestError(`${err.errors.link.message}`));
      }
      if (err.name === ('ValidationError' || 'CastError')) {
        next(new BadRequestError('Переданы некорректные данные при сохранении фильма'));
      } else { next(err); }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .orFail(new NotFoundError('Фильма не существует'))
    .then((movie) => {
      if (movie.owner.toString() === req.user._id) {
        return movie.remove()
          .then(() => res.send({ message: movie }));
      }

      return next(new ForbiddenError('Недостаточно прав для выполнения операции'));
    })
    .catch(next);
};
