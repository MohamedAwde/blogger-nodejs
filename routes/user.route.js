const {
  getAllUsers,
  signUp,
  signOut,
  signIn,
  getUser,
} = require("./../controllers/user.controller");
const router = require("express").Router();
const Joi = require("joi");
const Auth = require("../controllers/utils/Auth");

const validateSignInData = (req, res, next) => {
  const schema = Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);

  if (error) {
    return res.status(409).json({ message: error.details[0].message });
  } else {
    next();
  }
};

const validateSignUpData = (req, res, next) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
    avatar: Joi.string().required(),
    bio: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(409).json({ message: error.details[0].message });
  } else {
    next();
  }
};

router.route("/").get(getAllUsers);

router.route("/info").post(getUser);

router.route("/sign/up").post(validateSignUpData, signUp);

router.route("/sign/in").post(validateSignInData, signIn);

router.route("/sign/out", signOut);

module.exports = router;
