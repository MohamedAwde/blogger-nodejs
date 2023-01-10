const User = require("./../models/user.module");
var jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const getUser = async (req, res) => {
  const _id = req.body.userid;

  if (!_id) {
    return res.status(409).json({ message: "user id is required" });
  }

  try {
    const user = await User.findById({ _id }).lean().exec();
    const { password, ...u } = user;
    return res.json(u);
  } catch (error) {
    console.log(error);
    return res.status(404).json({ message: `user with id:${_id} not found` });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().lean().select("-password");
    if (users) {
      return res.json(users);
    } else {
      return res.status(404).json({ message: "no users were found." });
    }
  } catch (error) {
    console.log(error);
  }
};

const signUp = async (req, res) => {
  const { name, password, avatar, bio, email } = req.body;
  try {
    const hashed_password = await bcrypt.hash(password, 10);

    const new_user = await User.create({
      name,
      password: hashed_password,
      avatar,
      bio,
      email,
    });

    if (new_user) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });

      const { password, ...u } = new_user;

      return res.json({ ...u, token });
    } else {
      return res.status(500).json({ message: "error while sigging up" });
    }
  } catch (error) {
    console.log(error);
    return error.code == "11000"
      ? res.status(409).json({ message: "email already exists." })
      : res.status(500).send({ message: "error while sigging up user" });
  }
};

const signIn = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email }).lean().exec();

    if (user === null)
      return res.status(404).json({ message: "user is not found" });

    if (bcrypt.compare(password, user.password)) {
      const jwt_secret = process.env.JWT_SECRET;
      const token = jwt.sign({ userid: user._id }, jwt_secret, {
        expiresIn: "1h",
      });
      const { password, ...u } = user;
      return res.json(u);
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "error while logging in" });
  }
};

const signOut = async (req, res) => {
  return res.status(200).clearCookie("token").json();
};

module.exports = { getUser, getAllUsers, signUp, signIn, signOut };
