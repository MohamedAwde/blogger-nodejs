const User = require("../models/user.module");
const router = require("express").Router();
const Joi = require("joi");
const {
  geAllPosts,
  submitPost,
  getUserPosts,
  getPost,
  deletePost,
  updatePost,
} = require("../controllers/post.controller");
const Post = require("../models/post.module");
const Auth = require("../controllers/utils/Auth");

const validatePost = (req, res, next) => {
  const schema = Joi.object({
    author: Joi.string().required(),
    title: Joi.string().required(),
    content: Joi.string().required(),
    featured_image: Joi.string().required(),
  });

  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(409).json({ message: error.details[0].message });
  } else {
    next();
  }
};

router.route("/").get(geAllPosts);

router.route("/").post(validatePost, submitPost);

router.route("/user/:userid").get(getUserPosts);

router.route("/:id").get(getPost);

router.route("/:id").delete(Auth, deletePost);

router.route("/:id").put(updatePost);

router.route("/user/:id").get(getUserPosts);

module.exports = router;
