const router = require('express').Router();
const albumsRouter = require('./albums.js');
const artistRouter = require('./artists.js');
const commentsRouter = require('./comments.js');
// const currentUserRouter = require('./currentUser.js');
const playlistsRouter = require('./playlists.js');
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const songsRouter = require('./songs.js');
const { restoreUser } = require("../../utils/auth.js");

// Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

router.use('/currentUser', sessionRouter);

router.use('/user', usersRouter);

router.use('/artists', artistRouter);

router.use('/songs', songsRouter);

router.use('/albums', albumsRouter);

router.use('/comments', commentsRouter);

router.use('/playlists', playlistsRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

// router.delete(
//   '/logout',
//   (_req, res) => {
//     res.clearCookie('token');
//     return res.json({ message: 'success' });
//   }
// );

module.exports = router;