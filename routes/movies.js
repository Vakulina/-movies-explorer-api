const router = require('express').Router();
const { getMovies, postMovie, deleteMovie } = require('../controllers/movieController');
const celebrateErrorHandler = require('../middlewares/celebrate-error-handler');
const {
  validateDeletedMovie,
  validateNewMovie,
} = require('../middlewares/validation-requests');

router.get('/', getMovies);
router.post('/', validateNewMovie, celebrateErrorHandler, postMovie);
router.delete('/:id', validateDeletedMovie, celebrateErrorHandler, deleteMovie);

module.exports = router;
