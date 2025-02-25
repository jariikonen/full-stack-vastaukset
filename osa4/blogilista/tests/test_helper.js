const bcrypt = require('bcrypt');
// eslint-disable-next-line import/no-extraneous-dependencies
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');

const api = supertest(app);

const blogArray = [
  {
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
  },
  {
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
  },
  {
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
  },
  {
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
  },
  {
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
  },
  {
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
  },
];
const initialBlogs = blogArray.slice(0, 2);
const blogWithoutLikesField = {
  title: 'First class tests',
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
};
const blogWithoutTitleField = {
  author: 'Robert C. Martin',
  url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
  likes: 0,
};
const blogWithoutUrlField = {
  title: 'Type wars',
  author: 'Robert C. Martin',
  likes: 2,
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((user) => user.toJSON());
};

const nonExistingId = async () => {
  const blog = new Blog({
    title: 'thisisgoingtoberemoved',
    author: 'author',
    url: 'http://blog.org',
  });
  await blog.save();
  await blog.remove();

  return blog.id.toString();
};

const createUser = async (username) => {
  const passwordHash = await bcrypt.hash(username, 10);
  const user = new User({
    username,
    name: username,
    passwordHash,
  });
  await user.save();
};

const loginAs = async (username) => {
  const user = { username, password: username };
  const result = await api
    .post('/api/login')
    .send(user)
    .expect(200)
    .expect('Content-Type', /application\/json/);

  return result.body.token;
};

const insertInitialBlogsAs = async (username) => {
  const user = await User.findOne({ username });

  const blogObjects = initialBlogs.map((blog) => {
    const blogObject = new Blog(blog);
    blogObject.user = user._id;
    return blogObject;
  });
  const promiseArray = blogObjects.map((bo) => bo.save());
  await Promise.all(promiseArray);
};

module.exports = {
  blogArray,
  initialBlogs,
  blogWithoutLikesField,
  blogWithoutTitleField,
  blogWithoutUrlField,
  blogsInDb,
  usersInDb,
  nonExistingId,
  createUser,
  loginAs,
  insertInitialBlogsAs,
};
