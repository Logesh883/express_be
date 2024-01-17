const ImageSchema = require("./ImageSchema");
const LoginSchema = require("./LoginSchema");
const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const getuserPost = async (req, res, next) => {
  try {
    const user = await LoginSchema.findOne({ Email: req.params.Email }).select(
      "-Password -Email -MobileNumber"
    );

    if (!user) {
      next(error_handler(400, "user not Found"));
      return;
    }

    const userProfileImage = await ImageSchema.findOne({
      login: user._id,
    }).select("-login -name");

    const posts = await PostSchema.find({ login: user._id });

    if (!posts) {
      return res.json({
        len: 0,
        data: [],
        user: user,
        imageProfile: userProfileImage,
      });
    }
    res.status(200).json({
      post: posts,
    });
  } catch (err) {
    console.error(err);
    next(error_handler(405, err.message || "Error in fetching post"));
  }
};

module.exports = getuserPost;
