const LoginSchema = require("./LoginSchema");
const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const Account = async (req, res, next) => {
  try {
    const id = req.id;
    if (!id) {
      return next(error_handler(404, "Authentication failed"));
    }
    const user = await LoginSchema.findOne({ _id: id });
    if (!user) {
      return next(error_handler(404, "user not found"));
    }
    const posts = await PostSchema.find({ login: id });
    let postlength = 0;
    if (posts) {
      postlength = posts.length;
    }
    const date = new Date(user.createdAt);
    const formattedDate = date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    res.json({ user: [user, postlength, formattedDate] });
  } catch (err) {
    next(
      error_handler(err.status || 400, err.message || "error in fetching user")
    );
  }
};

module.exports = Account;
