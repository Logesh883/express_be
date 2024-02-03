const PostSchema = require("./PostSchema");

const feedPost = async (req, res) => {
  try {
    let skip;
    let PageLimit = 10;
    const page = req.query.page === undefined ? 1 : parseInt(req.query.page);

    if (page === 1) {
      skip = 0;
    } else {
      skip = (page - 1) * 10;
    }

    const totalLength = await PostSchema.find({});
    const data = await PostSchema.aggregate([
      { $skip: skip },
      { $limit: PageLimit },
    ]);

    if (page === 1) {
      res.json({ fetched: [data, totalLength.length] });
    } else {
      res.json({ fetched: data });
    }
  } catch (err) {
    res.json(err);
  }
};

module.exports = feedPost;
