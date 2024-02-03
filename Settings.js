const SettingSchema = require("./Model/SettingSchema");
const error_handler = require("./errorHandling");

const Settings = async (req, res, next) => {
  try {
    const id = req.id;
    if (!id) {
      return next(error_handler(401, "Unauthorized user"));
    }
    const feedSetting = req.body.status;
    const existsuser = await SettingSchema.findOne({ login: id });
    if (!existsuser) {
      return next(error_handler(404, "No user found"));
    }
    if (existsuser) {
      existsuser.feedSetting = feedSetting;
      existsuser.save();
      return res.json({
        msg: "Settings Updated Successfully",
      });
    }
  } catch (err) {
    res.json(err);
  }
};

const getSettings = async (req, res, next) => {
  const id = req.id;
  if (!id) {
    return next(error_handler(401, "Unauthorized user"));
  }
  try {
    const settings = await SettingSchema.findOne({ login: id });
    if (!settings) return next(error_handler(404, "User not  found"));
    res.json({ msg: settings });
  } catch (err) {
    res.json(err);
  }
};
module.exports = { Settings, getSettings };
