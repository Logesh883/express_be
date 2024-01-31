const LoginSchema = require("./LoginSchema");
const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const DeleteAccount = async (req, res, next) => {
  try {
    const id = req.id;

    if (!id) {
      return next(error_handler(401, "Unauthorzed Access"));
    }
    const user = await LoginSchema.findOne({ _id: id });
    res.setHeader("Cache-Control", "no-store");
    req.cookies[process.env.COOKIE_NAME] = "";
    res.clearCookie(process.env.COOKIE_NAME, {
      domain: "localhost",
      path: "/",
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });

    if (!user) {
      return next(error_handler(404, "User not found"));
    }
    const deleteuser = await LoginSchema.findByIdAndDelete({ _id: user.id });
    const postDelete = await PostSchema.deleteMany({ login: id });
    res.json({
      msg: "Account Deleted Sucessfully",
    });
  } catch (err) {
    res.json(err);
  }
};
module.exports = DeleteAccount;
