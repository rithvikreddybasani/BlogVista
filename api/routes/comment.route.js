const express = require("express");
const { verifyToken } = require("../utils/verifyUser.js");
const {
  createComment,
  deleteComment,
  editComment,
  getPostComments,
  getcomments,
  likeComment,
} = require("../controllers/comment.controller.js");

const router = express.Router();

router.post("/create", createComment);
router.get("/getPostComments/:postId", getPostComments);
router.put("/likeComment/:commentId",  likeComment);
router.put("/editComment/:commentId", editComment);
router.delete("/deleteComment/:commentId", deleteComment);
router.get("/getcomments", getcomments);

module.exports = router;
