const bcrypt = require("bcryptjs");
const LoginSchema = require("../LoginSchema");
const Logincheck = async (req, res) => {
  const email = await LoginSchema.findOne({ Email: req.query.Email });

  const CheckPass = await bcrypt.compare(req.query.Password, email.Password);
  res.json(CheckPass);
};
module.exports = Logincheck;
