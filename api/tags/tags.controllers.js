const Tag = require("../../models/Tag");

exports.tagsGet = async (req, res, next) => {
  try {
    const tags = await Tag.find().populate("posts", "title body");
    res.json(tags);
  } catch (error) {
    next(error);
  }
};
