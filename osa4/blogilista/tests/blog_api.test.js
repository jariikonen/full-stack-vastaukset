const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

beforeEach(async () => {
  await Blog.deleteMany({});
  await Blog.insertMany(helper.initialBlogs);
});

test('right amount of blogs are returned as json', async () => {
  const response = await api.get('/api/blogs');

  expect(response.status).toBe(200);
  expect(response.type).toBe('application/json');
  expect(response.body).toHaveLength(2);
});

test('name of the id field is "id" (not "_id")', async () => {
  const response = await api.get('/api/blogs');

  expect(response.body[0].id).toBeDefined();
  // eslint-disable-next-line no-underscore-dangle
  expect(response.body[0]._id).not.toBeDefined();
});

test('a valid blog can be added', async () => {
  await api
    .post('/api/blogs')
    .send(helper.blogArray[2])
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

  const blogTitles = blogsAtEnd.map((b) => b.title);
  expect(blogTitles).toContain('Canonical string reduction');
});

test('when likes field is not given a value it receives value of 0', async () => {
  const newBlog = {
    title: 'Ojasta allikkoon',
    author: 'Aku Ankka',
    url: 'http://www.ankanpulinat.pom',
  };

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/);

  const blogsAtEnd = await helper.blogsInDb();
  const newBlogFromDb = blogsAtEnd.filter((b) => b.title === 'Ojasta allikkoon')[0];
  expect(newBlogFromDb.likes).toEqual(0);
});

afterAll(() => {
  mongoose.connection.close();
});
