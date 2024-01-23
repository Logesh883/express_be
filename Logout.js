const Logout = async (req, res, next) => {
  const id = req.id;
  if (id) {
    res.clearCookie(process.env.COOKIE_NAME);
    req.cookies[process.env.COOKIE_NAME] = "";
    res.json({ msg: "Successfully Logout" });
  }
};
module.exports = Logout;
