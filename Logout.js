const Logout = async (req, res, next) => {
  const id = req.id;
  if (id) {
    await res.clearCookie(process.env.COOKIE_NAME, {
      domain: ".ideavista.online",
      path: "/",
      secure: true,
      sameSite: "lax",
      httpOnly: true,
    });
    req.cookies[process.env.COOKIE_NAME] = "";
    res.json({ msg: "Successfully Logout" });
  }
};
module.exports = Logout;
