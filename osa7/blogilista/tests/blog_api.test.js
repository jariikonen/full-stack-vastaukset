const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

const api = supertest(app);

describe('when there are initially some blogs saved', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    await helper.createUser('testi1');
    await helper.createUser('testi2');

    await Blog.deleteMany({});
    await helper.insertInitialBlogsAs('testi1');
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
    expect(response.body[0]._id).not.toBeDefined();
  });

  describe('adding a blog', () => {
    test(
      'adding a valid blog fails with statuscode 401 if there is no authorization token in the request',
      async () => {
        await api
          .post('/api/blogs')
          .send(helper.blogArray[2])
          .expect(401)
          .expect('Content-Type', /application\/json/);
      },
    );

    test('a valid blog can be added', async () => {
      const token = await helper.loginAs('testi1');

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(helper.blogArray[2])
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1);

      const blogTitles = blogsAtEnd.map((b) => b.title);
      expect(blogTitles).toContain('Canonical string reduction');
    });

    test('when "likes" field is not given a value, it receives value of 0', async () => {
      const token = await helper.loginAs('testi1');

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(helper.blogWithoutLikesField)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const blogsAtEnd = await helper.blogsInDb();
      const newBlogFromDb = blogsAtEnd.filter(
        (b) => b.title === helper.blogWithoutLikesField.title,
      )[0];
      expect(newBlogFromDb.likes).toEqual(0);
    });

    test('posting a blog without a title fails with statuscode 400', async () => {
      const token = await helper.loginAs('testi1');

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(helper.blogWithoutTitleField)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });

    test('posting a blog without a url fails with statuscode 400', async () => {
      const token = await helper.loginAs('testi1');

      await api
        .post('/api/blogs')
        .set('Authorization', `bearer ${token}`)
        .send(helper.blogWithoutUrlField)
        .expect(400)
        .expect('Content-Type', /application\/json/);
    });
  });

  describe('deletion of a blog', () => {
    test('succeeds with statuscode 204 if id is valid', async () => {
      const token = await helper.loginAs('testi1');

      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', `bearer ${token}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd.length).toBe(blogsAtStart.length - 1);

      const blogTitles = blogsAtEnd.map((b) => b.title);
      expect(blogTitles).not.toContain(blogToDelete.title);
    });

    test('fails with statuscode 404 if blog with the id is not found', async () => {
      const token = await helper.loginAs('testi1');

      const invalidBlogId = await helper.nonExistingId();

      await api
        .delete(`/api/blogs/${invalidBlogId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(404);
    });

    test('fails with status code 400 if id is malformed', async () => {
      const token = await helper.loginAs('testi1');

      const malformedId = '3';

      await api
        .delete(`/api/blogs/${malformedId}`)
        .set('Authorization', `bearer ${token}`)
        .expect(400);
    });
  });

  describe('update of a blog', () => {
    test('succeeds with statuscode 200 with valid id and blog data', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      blogToUpdate.likes += 1;

      const token = await helper.loginAs('testi1');

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `bearer ${token}`)
        .send(blogToUpdate)
        .expect(200);

      const blogsAtEnd = await helper.blogsInDb();
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length);

      const updatedBlog = blogsAtEnd[0];
      expect(updatedBlog.likes).toBe(blogToUpdate.likes);
    });

    test('fails with statuscode 404 if blog with the id is not found', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const invalidBlogId = await helper.nonExistingId();

      const token = await helper.loginAs('testi1');

      await api
        .put(`/api/blogs/${invalidBlogId}`)
        .set('Authorization', `bearer ${token}`)
        .send(blogToUpdate)
        .expect(404);
    });

    test('fails with status code 400 if id is malformed', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const malformedId = '3';

      const token = await helper.loginAs('testi1');

      await api
        .put(`/api/blogs/${malformedId}`)
        .set('Authorization', `bearer ${token}`)
        .send(blogToUpdate)
        .expect(400);
    });
  });
});

afterAll(() => {
  mongoose.connection.close();
});
