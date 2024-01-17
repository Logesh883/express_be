const LoginSchema = require("../LoginSchema");

const SignupCheck = async (req, res) => {
  const email = await LoginSchema.findOne({ Email: req.query.Email });

  res.json(email);
};
module.exports = SignupCheck;
