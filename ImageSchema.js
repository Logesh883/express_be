const mongoose = require("mongoose");

const imageSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      url: String,
      default:
        "https://res.cloudinary.com/dngjlekow/image/upload/v1705472140/samples/food/pot-mussels.jpg",
    },
    login: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerDetails",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CustomerImages", imageSchema);
