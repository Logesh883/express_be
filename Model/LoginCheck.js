const LoginSchema = require("../LoginSchema");
const error_handler = require("../errorHandling");
const json = require("jsonwebtoken");
const SettingSchema = require("./SettingSchema");
const COOKIE_NAME = process.env.COOKIE_NAME;

const Logincheck = async (req, res, next) => {
  const user = await LoginSchema.findOne({ Email: req.query.email });

  if (!user) {
    return next(error_handler(404, "user Email not found"));
  }
  const data = await SettingSchema({
    login: user.id,
  }).save();
  const jwt = json.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "3days",
  });
  res.setHeader("Cache-Control", "no-store");
  await res.cookie(COOKIE_NAME, jwt, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 50),
    httpOnly: true,
    sameSite: "lax",
    domain: ".ideavista.online",
    secure: true,
  });

  res.json({ msg: "Login succesfull", settings: data });
};
module.exports = Logincheck;
