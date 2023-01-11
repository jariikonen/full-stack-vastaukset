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

afterAll(() => {
  mongoose.connection.close();
});
