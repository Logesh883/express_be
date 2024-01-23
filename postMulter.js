const LoginSchema = require("./LoginSchema");
const PostSchema = require("./PostSchema");
const multer = require("multer");
const error_handler = require("./errorHandling");
const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();
const cloudinary = require("cloudinary").v2;
const path = require("path");
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const Post = async (req, res, next) => {
  try {
    const id = req.id;
    const user = await LoginSchema.findOne({ _id: id }, " -Email");

    let imageArray = [];

    if (!req.files || req.files.length === 0) {
      next(error_handler(404, "Files not received"));
      return;
    }

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];

      const extName = path.extname(file.originalname).toString();
      const file64 = parser.format(extName, file.buffer);

      const result = await cloudinary.uploader.upload(file64.content, {
        folder: "PostImages",
      });

      imageArray.push({
        name: result.public_id,
        url: result.secure_url,
      });
    }

    const newPost = await PostSchema({
      title: req.body.title,
      description: req.body.description,
      image: imageArray,
      login: user.id,
      username: user.UserName,
      userProfile: user.Profile,
    });

    await newPost.save();

    res.json({ msg: "Post Created" });
  } catch (err) {
    next(error_handler(405, err.message || "Error in upload"));
  }
};

const postImages = multer();

module.exports = { postImages, Post };
