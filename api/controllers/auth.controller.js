const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { errorHandler } = require("../utils/error");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All Fields are required"));
  }

  const hashed = bcrypt.hashSync(password, 10);

  try {
    const user = await User.create({ username, email, password: hashed });
    res.json({ message: "singup successfull", user });
  } catch (err) {
    next(err);
  }
};

exports.signin = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    return next(errorHandler(400, "All Fields are required"));
  }

  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    const validPassoword = bcrypt.compareSync(password, validUser.password);

    if (!validPassoword) {
      return next(errorHandler(400, "Invalid Password"));
    }
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    res
      .status(200)
      .cookie("access_token", token, { httpOnly: true })
      .json({ validUser });
  } catch (e) {
    next(e);
  }
};

exports.googleAuth = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(user); // Return only necessary info
    } else {
      const generatedPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });
      await user.save();
      const token = jwt.sign(
        { id: newUser._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET
      );
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json({ user });
    }
  } catch (error) {
    next(error);
  }
};
