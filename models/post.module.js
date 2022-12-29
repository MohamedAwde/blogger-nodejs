const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Postschema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    featured_image: {
      type: String,
      required: false,
      trim: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    views: {
      trim: true,
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", Postschema);

module.exports = Post;
