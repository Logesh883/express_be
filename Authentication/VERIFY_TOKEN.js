const jwt = require("jsonwebtoken");
const error_handler = require("../errorHandling");
const VERIFY_TOKEN = async (req, res, next) => {
  if (!req.cookies[process.env.COOKIE_NAME]) {
    return next(error_handler(401, "Go to Login"));
  }
  const cookies = req.cookies;
  const token = cookies[process.env.COOKIE_NAME];
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return next(error_handler(401, "Token not verified"));
    }
    req.id = user.id;
  });

  next();
};
module.exports = VERIFY_TOKEN;
