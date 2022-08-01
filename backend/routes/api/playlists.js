const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const {
  User,
  Songs,
  Albums,
  Playlists,
  PlaylistSongs,
} = require("../../db/models");

// deletes playlist by id
router.delete("/:playlistId", requireAuth, async (req, res, next) => {
  const { playlistId } = req.params;
  const selectedPlaylist = await Playlists.findByPk(playlistId);

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
router.post("/:playlistId", requireAuth, async (req, res, next) => {
  const { songId } = req.body;
  const { playlistId } = req.params;
  const selectedSong = await Songs.findByPk(songId);
  const selectedPlaylist = await Playlists.findByPk(playlistId);

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

    const addedPlaylistSong = await PlaylistSongs.findOne({
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
router.put('/:playlistId', requireAuth, async (req, res, next) => {
    const { name, image } = req.body;
    const { playlistId } = req.params;
    const editPlaylist = await Playlists.findByPk(playlistId);

    if(!editPlaylist){
        res.status(404);
        return res.json({ "message": "Playlist does not exist", "statusCode": 404 });
    }

   if(editPlaylist.userId === req.user.id){
        editPlaylist.update({
            name,
            previewImage: image
        });
        return res.json(editPlaylist);
    } else {
        return res.json({"message": "A playlist can only be edited by the user who created the playlist"});
    }
});

// get playlist by id
router.get("/:playlistId", async (req, res, next) => {
  const { playlistId } = req.params;
  const playlist = await Playlists.findOne({
    where: { id: playlistId },
    include: [
      {
        model: Songs,
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
router.post("/", requireAuth, async (req, res, next) => {
  const { name, image } = req.body;

  const createdPlaylist = await Playlists.create({
    userId: req.user.id,
    name,
    previewImage: image,
  });

  return res.json(createdPlaylist);
});

module.exports = router;
