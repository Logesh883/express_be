require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");

const compression = require("compression");
const cookieParser = require("cookie-parser");
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
    origin: ["https://expressyourthought.vercel.app"],
    methods: ["GET", "POST", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use("/api", router);
app.use((err, req, res, next) => {
  err = error_handler(err.status, err.message);
  res.status(err.status).json({ err: err.message, success: false });
});
app.get("/", async (req, res) => {
  res.json("Get");
});

app.post("/post", async (req, res) => {
  const { name, email, picture } = req.body;
  const user = await LoginSchema.findOne({ Email: email });
  if (user) {
    return res.json({ data: "User already found" });
  }

  const data = await LoginSchema({
    UserName: name,
    Email: email,
    Profile: picture,
  });
  const savedData = await data.save();
  res.json({ data: savedData, msg: "User registered successfully" });
});

const storage = multer.memoryStorage();
const uploads = multer({ storage: storage });

const DatauriParser = require("datauri/parser");
const VERIFY_TOKEN = require("./Authentication/VERIFY_TOKEN");
const PostSchema = require("./PostSchema");

const parser = new DatauriParser();

app.post(
  "/image",
  VERIFY_TOKEN,
  uploads.single("testImage"),
  async (req, res) => {
    try {
      const id = req.id;
      if (!req.file) {
        throw new Error(400, "No file uploaded");
      }
      const posts = await PostSchema.find({ login: id });

      const user = await LoginSchema.findOne({ _id: id });
      if (!user) {
        return error_handler(404, "User not found");
      }

      const extName = path.extname(req.file.originalname).toString();
      const file64 = parser.format(extName, req.file.buffer);

      const result = await cloudinary.uploader.upload(file64.content, {
        folder: "ProfileImages",
      });
      posts.map(async (val, i) => {
        val.userProfile = result.secure_url;
        await val.save();
      });
      if (user) {
        user.Profile = result.secure_url;
        await user.save();
        res.json({ msg: "Image Updated successfully" });
      }
    } catch (err) {
      res.status(err.status || 500).json({ err: err.message, success: false });
    }
  }
);

app.get("/fetchImage", VERIFY_TOKEN, async (req, res, next) => {
  const id = req.id;
  const user = await LoginSchema.findOne({ _id: id }, "-_id");
  if (!user) {
    return next(error_handler(404, "user not found"));
  }
  res.json({ fetched: user });
});
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log("Connected to server to " + PORT);
});
