const Post = require("../models/post.module");
const User = require("../models/user.module");

const geAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({});
    if (posts) {
      return res.json(posts);
    } else {
      return res.json({ message: "no posts found" });
    }
  } catch (error) {
    res.json({ message: "error while retrieving posts list" });
  }
};

const submitPost = async (req, res) => {
  try {
    const post = new Post({ ...req.body });
    if (post) {
      const user = await User.findOne({ _id: post.author }).exec();
      user.posts.push(post._id);
      await post.save();
      await user.save();
      return res.json(post);
    }
  } catch (error) {
    console.log(error);
    res.status(501).send({ error, message: "error while adding new post" });
  }
};

const getUserPosts = async (req, res) => {
  const author = req.params.userid;
  if (!author) {
    return res.status(409).json({ message: "user id is required" });
  }
  try {
    const posts = await Post.find({ author });
    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: `user with id:${author} not found` });
  }
};

const getPost = async (req, res) => {
  const _id = req.params.id;
  if (!_id) {
    return res.status(409).json({ message: "post id is required" });
  }
  try {
    const post = await Post.findOneAndUpdate(
      { _id },
      {
        $inc: { views: 1 },
      },
      { new: true, upsert: true }
    );
    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "error while retrieving post data" });
  }
};

const getUserPost = async (req, res) => {
  const author = req.params.userid;
  if (!author) {
    return res.status(409).json({ message: "user id is required" });
  }
  try {
    const post = await Post.find({ author });
    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(501).json({ message: "error while retrieving user's posts" });
  }
};

const deletePost = async (req, res) => {
  const _id = req.params.id;
  const user = req.body.userid;
  if (!_id) {
    return res.status(409).json({ message: "post id is required" });
  }
  try {
    const post = await Post.findByIdAndDelete({ _id }).exec();
    console.log(post);
    const user = User.findById({ _id: userid }).exec();
    console.log(user);
    user.posts = user.posts.filter((post) => post._id !== _id);
    await user.save();
    return res.json(post);
  } catch (error) {
    console.log(error);
    res.status(501).send({
      error: true,
      message: `error while deleting post with id:${_id}`,
    });
  }
};

const updatePost = async (req, res) => {
  const _id = req.params.id;
  if (!_id) {
    return res.status(409).json({ message: "post id is required" });
  }
  try {
    const post = await Post.findOneAndUpdate(
      { _id },
      {
        ...req.body,
      },
      { new: true, upsert: true }
    );
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ message: "error while retrieving post data" });
  }
};

module.exports = {
  geAllPosts,
  submitPost,
  getUserPosts,
  getPost,
  deletePost,
  updatePost,
  getUserPost,
};
