const express = require("express");
const router = express.Router();

const { requireAuth } = require("../../utils/auth.js");
const { Comments } = require("../../db/models");

// edit comment
router.put('/:commentId', requireAuth, async (req, res, next) => {
    const { body } = req.body;
    const { commentId } = req.params;
    const editComment = await Comments.findByPk(commentId);

    if(!editComment){
        res.status(404);
        return res.json({ "message": "Comment does not exist", "statusCode": 404 });
    }

   if(!body){
    res.status(400);
    return res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
            "body": "Comment text is required"
        }
    });
   }
   if(editComment.userId === req.user.id){
        editComment.update({
            body
        });
        return res.json(editComment);
    } else {
        return res.json({"message": "A comment can only be edited by the user who created the comment"});
    }
});

// deletes comment by id
router.delete("/:commentId", requireAuth, async (req, res, next) => {
  const { commentId } = req.params;
  const deleteComment = await Comments.findByPk(commentId);

  if (!deleteComment) {
    res.status(404);
    return res.json({ message: "Comment does not exist", statusCode: 404 });
  }

  if (deleteComment.userId === req.user.id) {
    await deleteComment.destroy();
    return res.json({ message: "Successfully deleted", statusCode: 200 });
  } else {
    return res.json({
      message: "A comment can only be deleted by the user who created the comment",
    });
  }
});

module.exports = router;
