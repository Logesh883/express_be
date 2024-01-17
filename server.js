require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const multer = require("multer");
const ImageSchema = require("./ImageSchema");
const compression = require("compression");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;
const path = require("path");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();
const LoginSchema = require("./LoginSchema");
const router = require("./Router");
const error_handler = require("./errorHandling");

mongoose
  .connect(process.env.URL)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use(
  cors({
    origin: ["https://expressyourthought.vercel.app", "http://localhost:3000"],
    methods: ["GET", "POST", "DELETE"],
  })
);
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use("/api", router);
app.use((err, req, res, next) => {
  err = error_handler(err.status, err.message);
  res.status(err.status).json({ err: err.message, success: false });
});
app.get("/get", async (req, res) => {
  res.json("Get");
});

app.post("/post", async (req, res) => {
  const hashPassword = await bcrypt.hash(req.body.Password, 10);
  const data = await LoginSchema({
    ...req.body,
    Password: hashPassword,
  });
  const savedData = await data.save();
  res.json({ data: savedData, msg: "User registered successfully" });
});

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

const DatauriParser = require("datauri/parser");
const parser = new DatauriParser();

app.post("/image/:Email", uploads.single("testImage"), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error(400, "No file uploaded");
    }

    const user = await LoginSchema.findOne({ Email: req.params.Email });
    if (!user) {
      throw new Error(404, "User not found");
    }

    const extName = path.extname(req.file.originalname).toString();
    const file64 = parser.format(extName, req.file.buffer);

    let image = await ImageSchema.findOne({ login: user._id });

    const result = await cloudinary.uploader.upload(file64.content, {
      folder: "ProfileImages",
    });

    if (image) {
      image.name = result.public_id;
      image.image.url = result.secure_url;
      await image.save();
      res.json({ msg: "Image Updated successfully" });
    } else {
      const newImage = new ImageSchema({
        name: result.public_id,
        image: {
          url: result.secure_url,
        },
        login: user._id,
      });
      await newImage.save();
      res.json({ msg: "Image Uploaded successfully" });
    }
  } catch (err) {
    res.status(err.status || 500).json({ err: err.message, success: false });
  }
});

app.get("/fetchImage/:Email", async (req, res, next) => {
  try {
    const idFound = await LoginSchema.findOne({ Email: req.params.Email });
    const details = await ImageSchema.findOne({ login: idFound._id });

    if (!details) {
      next(error_handler(404, "Please Update your Profile Picture"));
      return;
    }
    const imageid = details.image.url;

    const username = idFound.FirstName + " " + idFound.LastName;
    res.json({ msg: "Feteched", imageid: imageid, username: username });
  } catch (err) {
    res.json(err);
  }
});
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log("Connected to server to " + PORT);
});
