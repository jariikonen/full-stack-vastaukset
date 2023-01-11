const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body);

  const result = await blog.save();
  response.status(201).json(result);
});

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndRemove(request.params.id);
  if (result) {
    response.status(204).end();
  } else {
    response.status(404).send({ error: 'resource not found' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
  // eslint-disable-next-line object-curly-newline
  const { title, author, url, likes } = request.body;
  // eslint-disable-next-line object-curly-newline
  const blog = { title, author, url, likes };

  const updatedBlog = await Blog.findByIdAndUpdate(
    request.params.id,
    blog,
    { new: true, runValidators: true, context: 'query' },
  );

  if (updatedBlog) {
    response.json(updatedBlog);
  } else {
    response.status(404).send({ error: 'resource not found' });
  }
});

module.exports = blogsRouter;
