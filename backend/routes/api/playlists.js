const express = require("express");
const router = express.Router();

const { restoreUser, requireAuth } = require("../../utils/auth.js");
const {
  User,
  Song,
  Albums,
  Playlist,
  PlaylistSong,
} = require("../../db/models");

// deletes playlist by id
router.delete("/:playlistId", restoreUser, requireAuth, async (req, res, next) => {
  const { playlistId } = req.params;
  const selectedPlaylist = await Playlist.findByPk(playlistId);

  if (!selectedPlaylist) {
    res.status(404);
    return res.json({ message: "Playlist does not exist", statusCode: 404 });
  }

  if (selectedPlaylist.userId === req.user.id) {
    await selectedPlaylist.destroy();
    return res.json({ message: "Successfully deleted", statusCode: 200 });
  } else {
    return res.json({
      message: "A playlist can only be deleted by the user who created the playlist",
    });
  }
});

// add song to playlist by playlist id
router.post("/:playlistId", restoreUser, requireAuth, async (req, res, next) => {
  const { songId } = req.body;
  const { playlistId } = req.params;
  const selectedSong = await Song.findByPk(songId);
  const selectedPlaylist = await Playlist.findByPk(playlistId);

  if (!selectedSong) {
    res.status(404);
    return res.json({ message: "Song does not exist", statusCode: 404 });
  }
  if (!selectedPlaylist) {
    res.status(404);
    return res.json({ message: "Playlist does not exist", statusCode: 404 });
  }

  if (selectedPlaylist.userId === req.user.id) {
    await selectedPlaylist.addSong(selectedSong);

    const addedPlaylistSong = await PlaylistSong.findOne({
      where: { songId },
      order: [["createdAt"]],
      attributes: ["id", "playlistId", "songId"],
    });

    return res.json(addedPlaylistSong);
  } else {
    return res.json({
      message:
        "You can only add a song to a playlist if you are the user who created the playlist",
    });
  }
});

// edit playlist
router.put('/:playlistId', restoreUser, requireAuth, async (req, res, next) => {
    const { name, previewImage } = req.body;
    const { playlistId } = req.params;
    const editPlaylist = await Playlist.findByPk(playlistId);

    if(!editPlaylist){
        res.status(404);
        return res.json({ "message": "Playlist does not exist", "statusCode": 404 });
    }

    if (!name) {
      const err = new Error("Validation Error");
      err.status = 400;
      err.message = "Validation Error";
      err.errors = {
        name: "Playlist name is required"
      }
      return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
    }

   if(editPlaylist.userId === req.user.id){
        editPlaylist.update({
            name,
            previewImage
        });
        return res.json(editPlaylist);
    } else {
        return res.json({"message": "A playlist can only be edited by the user who created the playlist"});
    }
});

// get playlist by id
router.get("/:playlistId", async (req, res, next) => {
  console.log(await Playlist.findAll(), "Hi playlist")
  const { playlistId } = req.params;
  const playlist = await Playlist.findOne({
    where: { id: playlistId },
    include: [
      {
        model: Song,
        through: {
          attributes: [],
        },
      },
    ],
  });

  if (!playlist) {
    res.status(404);
    return res.json({
      message: "Playlist does not exist",
      statusCode: 404,
    });
  }

  return res.json(playlist);
});

// create new playlist
router.post("/", restoreUser, requireAuth, async (req, res, next) => {
  const { name, imageUrl } = req.body;

  
  const createdPlaylist = await Playlist.create({
    userId: req.user.id,
    name,
    previewImage: imageUrl,
  });
  
  if (!createdPlaylist.name) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    err.errors = {
      name: "Playlist name is required"
    }
    return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
  }
  return res.json(createdPlaylist);
});

module.exports = router;
