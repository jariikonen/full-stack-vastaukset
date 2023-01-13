const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const users = await User.find({});
  const newBlog = {
    title: request.body.title,
    author: request.body.author,
    url: request.body.url,
    likes: request.body.likes,
    user: users[0].id,
  };
  const blog = new Blog(newBlog);
  const savedBlog = await blog.save();

  users[0].blogs = users[0].blogs.concat(savedBlog.id);
  await users[0].save();

  response.status(201).json(savedBlog);
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
  /* eslint-disable object-curly-newline */
  const { title, author, url, likes } = request.body;
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
