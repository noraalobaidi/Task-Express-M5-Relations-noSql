const express = require('express');
const router = express.Router();
const {
  authorsGet,
  authorsUpdate,
  authorsDelete,
  authorsCreate,
  postsCreate,
} = require('./authors.controllers');

router.param('authorId', async (req, res, next, authorId) => {
  const author = await fetchMonument(+authorId, next);
  if (author) {
    req.author = author;
    next();
  } else {
    const err = new Error('Author Not Found');
    err.status = 404;
    next(err);
  }
});

router.get('/', authorsGet);
router.post('/', authorsCreate);
router.post('/:authorId/posts', postsCreate);

router.delete('/:authorId', authorsDelete);

router.put('/:authorId', authorsUpdate);

module.exports = router;
