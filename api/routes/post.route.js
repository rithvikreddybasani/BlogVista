const express = require("express");
const { verifyToken } = require("../utils/verifyUser");
const {
  create,
  getPosts,
  deletePost,
  update,
} = require("../controllers/post.controller");

const router = express.Router();

router.post("/create", verifyToken, create);

router.delete("/delete/:postId/:userId", verifyToken, deletePost);

router.put("/updatepost/:postId/:userId", verifyToken, update);

router.get("/getposts", getPosts);

module.exports = router;
