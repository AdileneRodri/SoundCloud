const express = require("express");

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Song, Album, Playlist } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  // check("email")
  //   .exists({ checkFalsy: true })
  //   .isEmail()
  //   .withMessage("Please provide a valid email."),
  // check("username")
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 4 })
  //   .withMessage("Please provide a username with at least 4 characters."),
  // check("username").not().isEmail().withMessage("Username cannot be an email."),
  // check("password")
  //   .exists({ checkFalsy: true })
  //   .isLength({ min: 6 })
  //   .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Get all Playlists created by Current User
router.get('/playlists',
restoreUser, requireAuth,
    async (req, res, next) => {
        const playlists = await Playlist.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Playlists": playlists});
});

// Get all Albums created by Current User
router.get('/albums',
restoreUser, requireAuth,
    async (req, res, next) => {
        const albums = await Album.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Albums": albums});
});

// Get all Songs created by Current User
router.get('/songs',
restoreUser, requireAuth,
    async (req, res, next) => {
        const songs = await Song.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Songs": songs});
});

// signUp User
router.post(
  '/signUp',
  validateSignup,
  async (req, res, next) => {
    const { email, firstName, lastName, password, username } = req.body;
    let checkEmailExists = await User.findOne({ where: { email: email}})
    let checkUsernameExists = await User.findOne({ where: { username: username}})

    if (!email || !username || !firstName || !lastName) {
      const err = new Error("Login failed");
      err.status = 400;
      err.message = "User already exists",
      err.errors = {
        email: "Invalid email",
        username: "Validation error",
        firstName: "First Name is required",
        lastName: "Last Name is required"
      };
      return res.status(403).json({ message: err.message, statusCode: err.status, errors: err.errors });
    }
    if (checkEmailExists) {
      const err = new Error("Login failed");
      err.status = 403;
      err.message = "User already exists",
      err.errors = {
        email: "User with that email already exists"
      };
      return res.status(403).json({ message: err.message, statusCode: err.status, errors: err.errors });
    }
    if (checkUsernameExists) {
      const err = new Error("Login failed");
      err.status = 403;
      err.message = "User already exists",
      err.errors = {
        username: "User with that username already exists"
      };
      return res.status(403).json({ message: err.message, statusCode: err.status, errors: err.errors });
    }
    
    const user = await User.signup({ email, firstName, lastName, username, password });
    let userData = user.toSafeObject();
    const accessToken = setTokenCookie(res, user);

    return res.json({
      id: userData.id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      username: userData.username,
      token: accessToken,
    });
  }
);


// Get current user
router.get("/", restoreUser, requireAuth, async (req, res, next) => {
  const currentUser = await User.getCurrentUserById(req.user.id);

  const jwtToken = await setTokenCookie(res, currentUser);

  if (jwtToken) {
    currentUser.dataValues.token = jwtToken;
  } else {
    currentUser.dataValues.token = "";
  }

  return res.json(currentUser);
});

module.exports = router;
