const router = require('express').Router();
const usersRouter = require('./users');
const moviesRouter = require('./movies');
const {
  postUser, login, logout,
} = require('../controllers/userController');
const NotFoundError = require('../errors/not-found-error');
const { auth } = require('../middlewares/auth');
const {
  validateNewUser,
  validateLogin,
} = require('../middlewares/validation-requests');
const celebrateErrorHandler = require('../middlewares/celebrate-error-handler');

router.post('/signup', validateNewUser, celebrateErrorHandler, postUser);
router.post('/signin', validateLogin, celebrateErrorHandler, login);
router.use(auth);
router.post('/signout', logout);  //ПО ЗАДАНИЮ УДАЛЯЕТ ТОКЕН ИЗ КУКИ РОУТ ЭТОТ РОУТ C POST!!!! ЗАПРОСОМ

router.use('/movies', moviesRouter);
router.use('/users', usersRouter);
router.use((req, res, next) => {
  next(new NotFoundError('Ресурс не найден'));
});
module.exports = router;
