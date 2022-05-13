### One To Many

1. Create a model for an author, with a `name` field.

```js
const { model, Schema } = require('mongoose');

const AuthorSchema = new Schema({
  name: String,
});

module.exports = model('Author', AuthorSchema);
```

2. Define the relationships in the `author` model. An author has many posts.

```js
const { model, Schema } = require('mongoose');

const AuthorSchema = new Schema({
  name: String,
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = model('Author', AuthorSchema);
```

3. Make the relationship from the other side, a `post` has one `author`:

```js
const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
  title: String,
  body: String,
  authorId: { type: Schema.Types.ObjectId, ref: 'Author' },
});

module.exports = model('Post', PostSchema);
```

4. Create `routes` and `controllers` for the `author` model.
5. Move the `post` create route and controller to the `author` routes and controllers.
6. In the post create function, Do the 3 steps:

   - Add the `authorId` to `req.body`.

   ```js
   try {
    [...]
    req.body.authorId = req.author.id;
    [...]
   }
   ```

   - Create the `post`.

   ```js
   try {
    [...]
    const newPost = await Post.create(req.body);
    [...]
   }
   ```

   - Add this created `post` in the `posts` array in the `author` model using `push`.

   ```js
   exports.postsCreate = async (req, res, next) => {
     try {
       req.body.authorId = req.author.id;
       const newPost = await Post.create(req.body);
       await Author.findByIdAndUpdate(req.author.id, {
         $push: { posts: newPost._id },
       });
       res.status(201).json(newPost);
     } catch (error) {
       next(error);
     }
   };
   ```

7. In the `author`s get route, use the `populate` method so that fetching `authors` will fetch the list of `posts` he has.

```js
exports.authorsGet = async (req, res, next) => {
  try {
    const authors = await Author.find({}, '-createdAt -updatedAt').populate(
      'posts'
    );
    res.json(authors);
  } catch (error) {
    next(error);
  }
};
```

8. In the `post` get route, make sure when fetching `posts`, we get the `author` object with each `post`.

```js
exports.postsGet = async (req, res, next) => {
  try {
    const posts = await Post.find({}, '-createdAt -updatedAt').populate(
      'authorId',
      'name'
    );
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
```

### Many To Many

1. Create a model for a `tag` with a `name` field.

```js
const { model, Schema } = require('mongoose');

const TagSchema = new Schema({
  name: String,
});

module.exports = model('Tag', TagSchema);
```

2. Define the relationships in `post` model. A `post` has many `tags`.

```js
const { model, Schema } = require('mongoose');

const PostSchema = new Schema({
  title: String,
  body: String,
  authorId: { type: Schema.Types.ObjectId, ref: 'Author' },
  tags: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Tag',
    },
  ],
});

module.exports = model('Post', PostSchema);
```

3. Define the relationships in `tag` model `tags` belongs to many `posts`.

```js
const { model, Schema } = require('mongoose');

const TagSchema = new Schema({
  name: String,
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
});

module.exports = model('Tag', TagSchema);
```

4. Create a route for adding a `tag` for a `post` in the `posts` routes file.

```js
router.post('/:postId/:tagId', tagAdd);
```

5. Create the `tagAdd` function and get the `tag` id from the req params.

```js
exports.tagAdd = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
```

6. Find the `post` using `findByIdAndUpdate` then insert the `tag` using `push`.

```js
exports.tagAdd = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    await Post.findByIdAndUpdate(req.post.id, {
      $push: { tags: tagId },
    });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
```

7. Find the `tag` using `findByIdAndUpdate` then insert the `post` using `push`.

```js
exports.tagAdd = async (req, res, next) => {
  try {
    const { tagId } = req.params;
    await Post.findByIdAndUpdate(req.post.id, {
      $push: { tags: tagId },
    });
    await Tag.findByIdAndUpdate(tagId, {
      $push: { posts: req.post.id },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
};
```

8. In the `posts` get route, use `populate` so that fetching posts will get us the `tags` added to this `post`.

```js
exports.postsGet = async (req, res, next) => {
  try {
    const posts = await Post.find({}, '-createdAt -updatedAt')
      .populate('authorId', 'name')
      .populate('tags', 'name');
    res.json(posts);
  } catch (error) {
    next(error);
  }
};
```

9. In the `tags` get route, do the same so fetching a `tag` will get us the `posts` related to this `post`.

```js
exports.tagsGet = async (req, res, next) => {
  try {
    const tags = await Tag.find({}, '-createdAt -updatedAt').populate(
      'posts',
      'name'
    );
    res.json(tags);
  } catch (error) {
    next(error);
  }
};
```
