const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {
    type: String,
    require: true,
    minlength: 5,
  },
  avatar: {
    type: String,
    require: true,
  },
  bio: {
    type: String,
    require: true,
    minlength: 5,
  },
  email: {
    type: String,
    require: true,
    unique: true,
    minlength: 5,
  },
  password: {
    type: String,
    require: true,
    minlength: 8,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
      default: null,
    },
  ],
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
