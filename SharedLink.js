const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const SharedPost = async (req, res, next) => {
  try {
    if (!req.params.id) {
      return next(error_handler(400, "Invalid URL"));
    }
    const post = await PostSchema.findOne({ _id: req.params.id });
    if (!post) {
      return next(error_handler(404, "Post is not available"));
    }
    res.json({ data: post });
  } catch (err) {
    res.json(err);
  }
};
module.exports = SharedPost;
