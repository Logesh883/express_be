const jwt = require("jsonwebtoken");
const LoginSchema = require("../LoginSchema");
const error_handler = require("../errorHandling");

const SignupCheck = async (req, res, next) => {
  const cookie = process.env.COOKIE_NAME;
  const cookies = req.cookies;
  if (!cookies) {
    return next(error_handler(404, "Coookie not found"));
  }
  const token = cookies[cookie];

  if (!token) {
    return;
  }
  const verify = jwt.verify(token, process.env.JWT_SECRET);
  if (!verify) {
    return;
  }

  const user = await LoginSchema.findOne({ _id: verify.id });
  if (!user) {
    return;
  }
  res.json({ msg: user });
};
module.exports = SignupCheck;
