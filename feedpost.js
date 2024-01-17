const PostSchema = require("./PostSchema");

const feedPost = async (req, res) => {
  try {
    const data = await PostSchema.aggregate([{ $sample: { size: 12 } }]);

    res.json({ fetched: data });
  } catch (err) {
    res.json(err);
  }
};

module.exports = feedPost;
