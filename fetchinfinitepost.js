const PostSchema = require("./PostSchema");
const error_handler = require("./errorHandling");

const fetchInfinite = async (req, res, next) => {
  try {
    const id = req.id;
    if (!id) {
      return next(error_handler(401, "Not Authorized"));
    }
    const post = await PostSchema.aggregate([{ $sample: { size: 5 } }]);
    res.json({ data: post });
  } catch (err) {
    console.log(err);
    res.json(err);
  }
};
module.exports = fetchInfinite;
