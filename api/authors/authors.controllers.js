const Author = require("../../models/Author");
const Post = require("../../models/Post");

exports.fetchAuthor = async (authorId,next) => {
  try {
    const author = await Author.findById(authorId);
    return author;
  } catch (error) {
    next(error);
  }
};

exports.authorsCreate = async (req, res,next) => {
  try {
    const newAuthor = await Author.create(req.body);
    res.status(201).json(newAuthor);
  } catch (error) {
    next(error);
  }
};
exports.postsCreate = async (req, res,next) => {
  const { authorId } = req.params;
  req.body.author = authorId;
  try {
    const newPost = await Post.create(req.body);
    await Author.findByIdAndUpdate(authorId, {
      $push: { posts: newPost._id },
    });
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};
exports.authorsDelete = async (req, res,next) => {
  try {
    await Author.findByIdAndRemove({ _id: req.author.id });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.authorsUpdate = async (req, res,next) => {
  try {
    await Author.findByIdAndUpdate(req.author.id, req.body);
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};

exports.authorsGet = async (req, res,next) => {
  try {
    const authors = await Author.find().populate("posts");
    res.json(authors);
  } catch (error) {
    next(error);
  }
};
