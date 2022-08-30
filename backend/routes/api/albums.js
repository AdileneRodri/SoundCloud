const express = require("express");
const router = express.Router();

const { User, Song, Album } = require("../../db/models");
const { restoreUser, requireAuth } = require("../../utils/auth.js");

// create a song using album id
router.post("/:albumId/songs", restoreUser, requireAuth, async (req, res, next) => {
  const { albumId } = req.params;
  const { title, description, url, imageUrl } = req.body;
  const album = await Album.findByPk(albumId);
  
    if (!album) {
      res.status(404);
      return res.json({
        message: "Album does not exist",
        statusCode: 404,
      });
    }

  if(!title || !url) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    err.errors = {
      title: "Album title is required",
      url: "Audio is required"
    }
    return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
  }

  if (album.userId === req.user.id) {
    const song = await Song.create({
      userId: req.user.id,
      albumId,
      title,
      description,
      url,
      previewImage: imageUrl,
    });

    return res.json(song);
  } else {
    return res.json({ message: "A song can only be added by user who created the album" });
  }
});

// Get details of an album by id
router.get("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;

  const album = await Album.findOne({
    where: { id: albumId },
    include: [
      {
        as: "Artist",
        model: User,
        attributes: ["id", "username", "previewImage"],
      },
      { model: Song },
    ],
  });

  if (!album) {
    res.status(404);
    return res.json({
      message: "Album does not exist",
      statusCode: 404,
    });
  }

  return res.json(album);
});

// edit album
router.put("/:albumId", restoreUser, requireAuth, async (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const { albumId } = req.params;
  const editAlbum = await Album.findByPk(albumId);

  if (!title) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    err.errors = {
      title: "Album title is required"
    }
    return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
  }

  if (!editAlbum) {
    res.status(404);
    return res.json({ message: "Album does not exist", statusCode: 404 });
  }

  if (editAlbum.userId === req.user.id) {
    editAlbum.update({
      title,
      description,
      previewImage: imageUrl,
    });
    return res.json(editAlbum);
  } else {
    return res.json({
      message: "An album can only be edited by the user that created the album",
    });
  }
});

// deletes an album
router.delete("/:albumId", restoreUser, requireAuth, async (req, res, next) => {
  const { albumId } = req.params;
  const selectedAlbum = await Album.findByPk(albumId);

  if (!selectedAlbum) {
    res.status(404);
    return res.json({ message: "Album does not exist", statusCode: 404 });
  }
  if (selectedAlbum.userId === req.user.id) {
    await selectedAlbum.destroy();
    return res.json({ message: "Successfully deleted", statusCode: 200 });
  } else {
    return res.json({
      message: "An album can only be deleted by the user who created the album",
    });
  }
});

// Creates album
router.post("/", restoreUser, requireAuth, async (req, res, next) => {
  const { title, description, imageUrl } = req.body;

  if (!title) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    err.errors = {
      title: "Album title is required"
    }
    return res.status(400).json({ message: err.message, statusCode: err.status, errors: err.errors });
  }

  const newAlbum = await Album.create({
    userId: req.user.id,
    title,
    description,
    previewImage: imageUrl,
  });

  return res.json(newAlbum);
});

// Gets all albums
router.get("/", async (req, res, next) => {
  const allAlbums = await Album.findAll();
  return res.json({ Album: allAlbums });
});

module.exports = router;
