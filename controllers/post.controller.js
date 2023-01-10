const Post = require("../models/post.module");
const User = require("../models/user.module");

const geAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({}).populate({
      path: "author",
      select: "-posts -email -password",
    });
    if (posts) {
      return res.json(posts);
    } else {
      return res.json({ message: "no posts found" });
    }
  } catch (error) {
    console.log(error);
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
    const user = await User.findById({ _id: author }).select(
      "-posts -email -password"
    );
    return res.json({ posts, user });
  } catch (error) {
    console.log(error);
    return res
      .status(404)
      .json({ message: `user with id:${author} not found` });
  }
};

const getPost = async (req, res) => {
  const _id = req.params.postid;
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
    ).populate({ path: "author", select: "-password -email -posts -__v" });

    return res.json(post);
  } catch (error) {
    console.log(error);
    return res
      .status(501)
      .json({ message: "error while retrieving post data" });
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
    return res
      .status(501)
      .json({ message: "error while retrieving user's posts" });
  }
};

const deletePost = async (req, res) => {
  console.log("post delete route");
  const { postid, userid } = req.params;
  if (!postid || !userid) {
    return res
      .status(409)
      .json({ message: "post id and user id are required" });
  }
  try {
    const post = await Post.findByIdAndDelete({ _id: postid }).exec();
    if (!post) {
      return res.status(404).json({ message: "post not found" });
    }
    const user = await User.findById({ _id: userid }).exec();
    if (!user) {
      return res.status(404).json({ message: "user not found" });
    }
    user.posts = user.posts.filter((post) => post._id !== postid);
    await user.save();
    return res.json(post);
  } catch (error) {
    console.log(error);
    return res.status(501).json({
      message: `error while deleting post with id:${postid}`,
    });
  }
};

const updatePost = async (req, res) => {
  const postid = req.params.postid;
  if (!postid) {
    return res.status(409).json({ message: "post id is required" });
  }
  try {
    const post = await Post.findOneAndUpdate(
      { _id: postid },
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
