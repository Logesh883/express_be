const mongoose = require("mongoose");

const LoginSchema = mongoose.Schema(
  {
    UserName: {
      type: String,
      required: true,
    },
    Email: {
      type: String,
      required: true,
    },
    Profile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerDetails", LoginSchema);
