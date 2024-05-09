const express = require("express");
const {
  test,
  updateUser,
  deleteUser,
  signout,
  getusers,
  getuser,
} = require("../controllers/user.controller.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

router.route("/test").get(test);
router.put("/update/:userId",  updateUser);
router.delete("/delete/:userId",  deleteUser);
router.post("/signout", signout);
router.get("/getusers",  getusers);
router.get("/:userId", getuser);

module.exports = router;
