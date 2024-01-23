const LoginSchema = require("../LoginSchema");
const error_handler = require("../errorHandling");
const json = require("jsonwebtoken");
const COOKIE_NAME = process.env.COOKIE_NAME;

const Logincheck = async (req, res, next) => {
  const user = await LoginSchema.findOne({ Email: req.query.email });

  if (!user) {
    return next(error_handler(404, "user not found"));
  }
  const jwt = json.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "1hr",
  });
  res.cookie(COOKIE_NAME, jwt, {
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 58),
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    domain: ".vercel.app",
  });

  res.json({ msg: "Login succesfull" });
};
module.exports = Logincheck;
