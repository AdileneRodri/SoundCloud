const express = require("express");
const router = express.Router();

const { restoreUser, requireAuth } = require("../../utils/auth.js");
const { User, Songs, Albums, Comments } = require("../../db/models");


// get comments by song Id
router.get("/:songId/comments", async (req, res, next) => {
  const { songId } = req.params;
  const song = await Songs.findByPk(songId);

  if (!song) {
    res.status(404);
    return res.json({ message: "Song does not exist", statusCode: 404 });
  }

  const allComments = await Comments.findAll({
    where: { songId },
    include: [
      {
        model: User,
        attributes: ["id", "username"],
      },
    ],
  });

  return res.json({ Comments: allComments });
});

// add comment by song id
router.post('/:songId/comments', 
restoreUser, requireAuth,
    async (req, res, next) => {
        const { comment } = req.body;
        const { songId } = req.params;
        const selectedSong = await Songs.findByPk(songId);

        if(!selectedSong){
            res.status(404);
            return res.json({ "message": "Song does not exist", "statusCode": 404 });
        }

        const createdComment = await Comments.create({
            userId: req.user.id,
            songId, 
            comment
        });

        return res.json(createdComment);
});


// get song by id
router.get("/:songId", async (req, res, next) => {
  const { songId } = req.params;
  const selectedSong = await Songs.findOne({
    where: { id: songId },
    include: [
      { model: Albums, attributes: ["id", "title", "previewImage"] },
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
router.put('/:songId', restoreUser, requireAuth, async (req, res, next) => {
    const { title, description, url, image } = req.body;
    const { songId } = req.params;
    const editSong = await Songs.findByPk(songId);

    if(!editSong){
        res.status(404);
        return res.json({ "message": "Song does not exist", "statusCode": 404 });
    }

   if(editSong.userId === req.user.id){
        editSong.update({
            title, 
            description, 
            url, 
            previewImage: image
        });
        return res.json(editSong)
    } else {
        return res.json({"message": "A song can only be updated by the user who created the song"});
    }
});

// deletes song by id
router.delete("/:songId", restoreUser, requireAuth, async (req, res, next) => {
  const { songId } = req.params;
  const selectedSong = await Songs.findByPk(songId);

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
  const allSongs = await Songs.findAll();

  return res.json({ Songs: allSongs });
});

module.exports = router;
