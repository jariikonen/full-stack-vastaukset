const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog
    .find({})
    .populate('user', { username: 1, name: 1, id: 1 });
  response.json(blogs);
});

// eslint-disable-next-line consistent-return
blogsRouter.post('/', async (request, response) => {
  const { user, body } = request;
  if (!user) {
    return response.status(401).json({ error: 'not logged in' });
  }

  const newBlog = {
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  };
  const blog = new Blog(newBlog);
  const savedBlog = await blog.save();

  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();

  await savedBlog.populate('user', { username: 1, name: 1, id: 1 });
  response.status(201).json(savedBlog);
});

// eslint-disable-next-line consistent-return
blogsRouter.delete('/:id', async (request, response) => {
  const { user, params } = request;

  if (!user) {
    return response.status(401).json({ error: 'not logged in' });
  }

  const blogToDelete = await Blog.findById(params.id);
  if (!blogToDelete) {
    return response.status(404).send({ error: 'resource not found' });
  }

  if (blogToDelete.user.toString() === user._id.toString()) {
    await blogToDelete.remove();
    user.blogs = user.blogs.filter((blogId) => blogId.toString() !== blogToDelete._id.toString());
    await user.save();
    response.status(204).end();
  } else {
    response.status(401).json({ error: 'unauthorized' });
  }
});

blogsRouter.put('/:id', async (request, response) => {
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
