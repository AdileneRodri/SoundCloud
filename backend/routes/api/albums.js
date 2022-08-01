const express = require("express");
const router = express.Router();

const { User, Songs, Albums } = require("../../db/models");
const { requireAuth } = require("../../utils/auth.js");

// create a song using album id
router.post("/:albumId/songs", requireAuth, async (req, res, next) => {
  const { albumId } = req.params;
  const { title, description, url, image } = req.body;
  const album = await Albums.findByPk(albumId);

  if (!album) {
    res.status(404);
    return res.json({
      message: "Album does not exist",
      statusCode: 404,
    });
  }

  if (album.userId === req.user.id) {
    const song = await Songs.create({
      userId: req.user.id,
      albumId,
      title,
      description,
      url,
      previewImage: image,
    });

    return res.json(song);
  } else {
    return res.json({ message: "A song can only be added by user who created the album" });
  }
});

// Get details of an album by id
router.get("/:albumId", async (req, res, next) => {
  const { albumId } = req.params;

  const album = await Albums.findOne({
    where: { id: albumId },
    include: [
      {
        as: "Artist",
        model: User,
        attributes: ["id", "username", "previewImage"],
      },
      { model: Songs },
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
router.put("/:albumId", requireAuth, async (req, res, next) => {
  const { title, description, imageUrl } = req.body;
  const { albumId } = req.params;
  const editAlbum = await Albums.findByPk(albumId);

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
router.delete("/:albumId", requireAuth, async (req, res, next) => {
  const { albumId } = req.params;
  const selectedAlbum = await Albums.findByPk(albumId);

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
router.post("/", requireAuth, async (req, res, next) => {
  const { title, description, image } = req.body;

  const newAlbum = await Albums.create({
    userId: req.user.id,
    title,
    description,
    previewImage: image,
  });

  return res.json(newAlbum);
});

// Gets all albums
router.get("/", async (req, res, next) => {
  const allAlbums = await Albums.findAll();
  return res.json({ Albums: allAlbums });
});

module.exports = router;
