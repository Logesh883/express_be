const mongoose = require("mongoose");

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please give title"],
  },
  description: {
    type: String,
    required: true,
    minLength: [3, "Please enter description more than 3 Charcters"],
  },
  image: [
    {
      name: String,
      url: String,
    },
  ],
  login: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CustomerDetails",
  },
  username: {
    type: String,
  },
  publicID: {
    type: String,
  },
  userProfile: [
    {
      type: String,
    },
  ],
});
module.exports = mongoose.model("posts", PostSchema);
