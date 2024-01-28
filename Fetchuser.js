const LoginSchema = require("./LoginSchema");
const error_handler = require("./errorHandling");

const fetchUser = async (req, res, next) => {
  const id = req.id;

  if (!id) {
    return next(error_handler(400, "User not found"));
  }
  const user = await LoginSchema.find({ _id: id });
  if (!user) {
    return next(error_handler(404, "No User Details"));
  }
  res.json({ user: user });
};
module.exports = fetchUser;
