const express = require("express");

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User, Songs, Albums, Playlists } = require("../../db/models");
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateSignup = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("Please provide a valid email."),
  check("username")
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage("Please provide a username with at least 4 characters."),
  check("username").not().isEmail().withMessage("Username cannot be an email."),
  check("password")
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage("Password must be 6 characters or more."),
  handleValidationErrors,
];

// Get all Playlists created by Current User
router.get('/playlists',
restoreUser, requireAuth,
    async (req, res, next) => {
        const playlists = await Playlists.findAll({
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
        const albums = await Albums.findAll({
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
        const songs = await Songs.findAll({
            where: {
                userId: req.user.id
            }
        });
        return res.json({"Songs": songs});
});

// signUp
// change response body, reference readme
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, firstName, lastName, password, username } = req.body;
    const user = await User.signup({ email, firstName, lastName, username, password });

    await setTokenCookie(res, user);

    return res.json({
      user,
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
