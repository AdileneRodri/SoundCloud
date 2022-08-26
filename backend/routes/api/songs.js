const express = require("express");
const router = express.Router();
const { environment } = require("../../config");
const isProduction = environment === "production";

const { restoreUser, requireAuth } = require("../../utils/auth.js");
const { User, Song, Album, Comment } = require("../../db/models");


// delete comment
router.delete(
  "/:songId/comments/:commentId",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { commentId } = req.params;
    const deleteComment = await Comment.findByPk(commentId);

    if (!deleteComment) {
      res.status(404);
      return res.json({ message: "Comment does not exist", statusCode: 404 });
    }

    if (deleteComment.userId === req.user.id) {
      await deleteComment.destroy();
      return res.json({ message: "Successfully deleted", statusCode: 200 });
    } else {
      return res.json({
        message:
          "A comment can only be deleted by the user who created the comment",
      });
    }
  }
);

// edit comment
router.put(
  "/:songId/comments/:commentId",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    const { body } = req.body;
    const { commentId } = req.params;
    const editComment = await Comment.findByPk(commentId);

    if (!editComment) {
      res.status(404);
      return res.json({ message: "Comment does not exist", statusCode: 404 });
    }

    if (!body) {
      res.status(400);
      return res.json({
        message: "Validation Error",
        statusCode: 400,
        errors: {
          body: "Comment body text is required",
        },
      });
    }

    if (editComment.userId === req.user.id) {
      editComment.update({
        body,
      });
      return res.json(editComment);
    } else {
      return res.json({
        message:
          "A comment can only be edited by the user who created the comment",
      });
    }
  }
);

// get comments by song Id
router.get("/:songId/comments", async (req, res, next) => {
  const { songId } = req.params;
  const song = await Song.findByPk(songId);

  if (!song) {
    res.status(404);
    return res.json({ message: "Song does not exist", statusCode: 404 });
  }

  const allComments = await Comment.findAll({
    where: { songId },
    include: [
      {
        model: User,
        attributes: ["id", "username"],
      },
    ],
  });

  return res.json({ Comment: allComments });
});

// add comment by song id
router.post(
  "/:songId/comments",
  restoreUser,
  requireAuth,
  async (req, res, next) => {
    // change comment to body
    const { body } = req.body;
    const { songId } = req.params;
    const selectedSong = await Song.findByPk(songId);

    if (!selectedSong) {
      res.status(404);
      return res.json({ message: "Song does not exist", statusCode: 404 });
    }

    if (!body) {
      const err = new Error("Validation Error");
      err.status = 400;
      err.message = "Validation Error";
      err.errors = {
        body: "Comment body text is required",
      };
      return res
        .status(400)
        .json({
          message: err.message,
          statusCode: err.status,
          errors: err.errors,
        });
    }

    const createdComment = await Comment.create({
      userId: req.user.id,
      songId,
      body
    });

    return res.json(createdComment);
  }
);

// get song by id
router.get("/:songId", async (req, res, next) => {
  const { songId } = req.params;
  const selectedSong = await Song.findOne({
    where: { id: songId },
    include: [
      { model: Album, attributes: ["id", "title", "previewImage"] },
      {
        as: "Artist",
        model: User,
        attributes: ["id", "username", "previewImage"],
      },
    ],
  });

  if (!selectedSong) {
    res.status(404);
    return res.json({
      message: "Song does not exist",
      statusCode: 404,
    });
  }

  return res.json(selectedSong);
});

// edit song by id
router.put("/:songId", restoreUser, requireAuth, async (req, res, next) => {
  const { title, description, url, imageUrl } = req.body;
  const { songId } = req.params;
  const editSong = await Song.findByPk(songId);

  if (!editSong) {
    res.status(404);
    return res.json({ message: "Song does not exist", statusCode: 404 });
  }

  if (!title || !url) {
    const err = new Error("Validation Error");
    err.status = 400;
    err.message = "Validation Error";
    err.errors = {
      title: "Album title is required",
      url: "Audio is required",
    };
    return res
      .status(400)
      .json({
        message: err.message,
        statusCode: err.status,
        errors: err.errors,
      });
  }

  if (editSong.userId === req.user.id) {
    editSong.update({
      title,
      description,
      url,
      previewImage: imageUrl,
    });
    return res.json(editSong);
  } else {
    return res.json({
      message: "A song can only be updated by the user who created the song",
    });
  }
});

// deletes song by id
router.delete("/:songId", restoreUser, requireAuth, async (req, res, next) => {
  const { songId } = req.params;
  const selectedSong = await Song.findByPk(songId);

  if (!selectedSong) {
    res.status(404);
    return res.json({ message: "Song does not exist", statusCode: 404 });
  }
  if (selectedSong.userId === req.user.id) {
    await selectedSong.destroy();
    return res.json({ message: "Successfully deleted", statusCode: 200 });
  } else {
    return res.json({
      message: "A song can only be deleted by the user who created the song",
    });
  }
});

// get all songs
router.get("/", async (req, res, next) => {
  const allSongs = await Song.findAll();

  let { page, size, title, createdAt } = req.query;
  if (page) page = parseInt(page);
  if (size) size = parseInt(size);

  let where = {};
  let pag = {};

  if (!page) page = 0;
  if (!size) size = 20;

  if (page > 10) {
    page = 0;
  } else {
    page = page;
  }

  if (size > 20) {
    size = 20;
  } else {
    size = size;
  }

  if (page > 0) {
    pag.limit = size;
    pag.offset = size * (page - 1);
  } else {
    pag.limit = size;
  }

  if (isProduction) {
    if (title) where.title = { [Op.iLike]: `%${title}%` };
    if (createdAt) where.createdAt = createdAt;
  } else {
    if (title) where.title = { [Op.like]: `%${title}%` };
    if (createdAt) where.createdAt = createdAt;
  }

  return res.json({ Songs: allSongs, page, size });
});

module.exports = router;
