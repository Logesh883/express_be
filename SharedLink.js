const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const SharedPost = async (req, res, next) => {
  const post = await PostSchema.findOne({ _id: req.params.id });
  if (!post) {
    return next(error_handler(404, "Post is not available"));
  }
  res.json({ data: post });
};
module.exports = SharedPost;
