const router = require('express').Router();
const { getUser, updateUser } = require('../controllers/userController');
const {
  validateUpdateUser,
} = require('../middlewares/validation-requests');
const celebrateErrorHandler = require('../middlewares/celebrate-error-handler');

router.get('/me', getUser);
router.patch('/me', validateUpdateUser, celebrateErrorHandler, updateUser);

module.exports = router;
