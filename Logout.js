const Logout = async (req, res, next) => {
  const id = req.id;
  if (id) {
    res.setHeader("Cache-Control", "no-store");
    req.cookies[process.env.COOKIE_NAME] = "";
    return res
      .clearCookie(process.env.COOKIE_NAME, {
        domain: ".ideavista.online",
        path: "/",
        secure: true,
        sameSite: "lax",
        httpOnly: true,
      })
      .json({ msg: "Successfully Logout" });
  }
};
module.exports = Logout;
