const Post = require("../../models/Post");
const Tag = require("../../models/Tag");

exports.fetchPost = async (postId, next) => {
  try {
    const post = await Post.findById(postId);
    return post;
  } catch (error) {
    next(error);
  }
};

exports.postsDelete = async (req, res, next) => {
  try {
    await Post.findByIdAndRemove({ _id: req.post.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.postsUpdate = async (req, res, next) => {
  try {
    await Post.findByIdAndUpdate(req.post.id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.postsGet = async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author").populate("tags", "name");
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
exports.tagAdd = async (req, res, next) => {
  const { postId } = req.params;

  try {
    const newTag = await Tag.create(req.body);
    await Post.findByIdAndUpdate(postId, {
      $push: { tags: newTag._id },
    });
    const updatedTag = await Tag.findByIdAndUpdate(
      newTag._id,
      {
        $push: { posts: postId },
      },
      { new: true }
    );

    res.status(201).json(updatedTag);
  } catch (error) {
    next(error);
  }
};
