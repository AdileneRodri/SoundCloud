const express = require('express')
const router = express.Router();

const { setTokenCookie, restoreUser } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check, cookie } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const validateLogin = [
  check('email')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
]; 

router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.login({ email, password });

    if (!user) {
      const err = new Error('Login failed');
      err.status = 401;
      err.title = 'Login failed';
      err.errors = ['The provided emails were invalid.'];
      return next(err);
    }

    const jwtToken = await setTokenCookie(res, user);

    if(jwtToken){
      user.dataValues.token = jwtToken;
    } else {
      user.dataValues.token = "";
    }

    return res.json(user);
  }
);
  
module.exports = router;