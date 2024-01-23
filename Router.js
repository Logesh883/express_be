const express = require("express");
const SignupCheck = require("./Model/SigninCheck");
const Logincheck = require("./Model/LoginCheck");
const { postImages, Post } = require("./postMulter");
const getuserPost = require("./getUserPost");
const removeData = require("./RemovePost");
const feedPost = require("./feedpost");
const VERIFY_TOKEN = require("./Authentication/VERIFY_TOKEN");
const Logout = require("./Logout");
const router = express.Router();

router.get("/check", SignupCheck);
router.get("/login", Logincheck);
router.post("/post", postImages.array("postimage", 4), VERIFY_TOKEN, Post);
router.get("/getUserPost", VERIFY_TOKEN, getuserPost);
router.delete("/removePost/:id", VERIFY_TOKEN, removeData);
router.get("/allpost", VERIFY_TOKEN, feedPost);
router.get("/logout", VERIFY_TOKEN, Logout);

module.exports = router;
