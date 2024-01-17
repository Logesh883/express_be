const express = require("express");
const SignupCheck = require("./Model/SigninCheck");
const Logincheck = require("./Model/LoginCheck");
const { postImages, Post } = require("./postMulter");
const error_handler = require("./errorHandling");
const getuserPost = require("./getUserPost");
const removeData = require("./RemovePost");
const feedPost = require("./feedpost");
const router = express.Router();

router.get("/check", SignupCheck);
router.get("/login", Logincheck);
router.post("/post/:Email", postImages.array("postimage", 4), Post);
router.get("/getUserPost/:Email", getuserPost);
router.delete("/removePost/:id", removeData);
router.get("/allpost", feedPost);

module.exports = router;
