const postSchema = require("./PostSchema");
const error_handler = require("./errorHandling");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const removeData = async (req, res, next) => {
  try {
    const id = req.id;
    const postData = await postSchema.findById(req.params.id);
    if (id == postData.login) {
      const images = postData.image;
      const imagesarray = [];
      for (let index = 0; index < images.length; index++) {
        imagesarray.push(images[index].name);
      }

      if (!postData) {
        next(error_handler(404, "No data Found"));
        return;
      }
      for (imageUrl of imagesarray) {
        await cloudinary.uploader.destroy(imageUrl);
      }
      await postSchema.findByIdAndDelete(req.params.id);
      res.json({ message: "Deleted" });
    }
  } catch (err) {
    next(error_handler(400, err.message));
  }
};

module.exports = removeData;
