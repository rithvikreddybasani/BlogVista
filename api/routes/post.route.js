const express = require("express");
const { verifyToken } = require("../utils/verifyUser");
const {
  create,
  getPosts,
  deletePost,
  update,
} = require("../controllers/post.controller");

const router = express.Router();

router.post("/create",  create);

router.delete("/delete/:postId/:userId",  deletePost);

router.put("/updatepost/:postId/:userId",  update);

router.get("/getposts", getPosts);

module.exports = router;
