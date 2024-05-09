const express = require("express");
const {
  signup,
  signin,
  googleAuth,
} = require("../controllers/auth.controller");

const router = express.Router();

router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/google").post(googleAuth);
module.exports = router;
