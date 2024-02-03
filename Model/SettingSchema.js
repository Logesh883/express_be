const mongoose = require("mongoose");

const SettingSchema = mongoose.Schema({
  feedSetting: {
    type: Boolean,
    default: false,
  },
  login: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});
module.exports = mongoose.model("Settings", SettingSchema);
