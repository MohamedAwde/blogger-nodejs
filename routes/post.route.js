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

const postNewVildate = (req, res, next) => {
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

const postUpdateVildate = (req, res, next) => {
  const schema = Joi.object({
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

router.route("/").post(postNewVildate, submitPost);

router.route("/:postid").get(getPost);

router.route("/user/:userid").get(getUserPosts);

router.route("/user/:userid").get(getUserPosts);

router.route("/:userid/:postid/").delete(deletePost);

router.route("/:userid/:postid/").put(postUpdateVildate, updatePost);

module.exports = router;
