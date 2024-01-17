const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      url: String,
    },
    login: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerDetails",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerImages", imageSchema);
