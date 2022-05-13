# Blog Author ✍️

## Instructions

- Fork and clone [this repository](https://github.com/JoinCODED/Task-Express-M5-Relations-noSql) to your `Development` folder.

### One To Many

1. Create a model for an author, with a `name` field.
2. Define the relationships in the `post` model. An author has many posts.
3. Create `routes` and `controllers` for the `author` model.
4. Move the `post` create route and controller to the `author` routes and controllers.
5. In the post create function, Do the 3 steps:

   - Add the `authorId` to `req.body`.
   - Create the `post`.
   - Add this created `post` in the `posts` array in the `author` model using `push`.

6. In the `author`s get route, use the `populate` method so that fetching `authors` will fetch the list of `posts` he has.
7. In the `post` get route, make sure when fetching `posts`, we get the `author` object with each `post`.

### Many To Many

1. Create a model for a `tag` with a `name` field.
2. Define the relationships in `post` model. A `post` has many `tags`.
3. Define the relationships in `tag` model `tags` belongs to many `posts`.
4. Create a route for adding a `tag` for a `post` in the `posts` routes file.
5. Create the `tagAdd` function and get the `tag` id from the req params.
6. Find the `post` using `findByIdAndUpdate` then insert the `tag` using `push`.
7. Find the `tag` using `findByIdAndUpdate` then insert the `post` using `push`.
8. In the `posts` get route, use `populate` so that fetching posts will get us the `tags` added to this `post`.
9. In the `tags` get route, do the same so fetching a `tag` will get us the `posts` related to this `post`.
