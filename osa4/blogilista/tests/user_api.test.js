const bcrypt = require('bcrypt');
const supertest = require('supertest');
const app = require('../app');
const helper = require('./test_helper');
const User = require('../models/user');

const api = supertest(app);

describe('when there is initially one user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('sekret', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb();

    const newUser = {
      username: 'jikonen',
      name: 'Jari Ikonen',
      password: 'salainen',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await helper.usersInDb();
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1);

    const usernames = usersAtEnd.map((u) => u.username);
    expect(usernames).toContain(newUser.username);
  });

  test('user can be listed and password hash is not on the listing', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/);

    const usersFromDb = response.body;
    expect(usersFromDb).toHaveLength(1);
    expect(usersFromDb[0].username).toBe('root');
    expect(usersFromDb[0].passwordHash).not.toBeDefined();
  });

  describe('when trying to create a user with invalid credentials', () => {
    test('creation fails with proper statuscode and message if username is already taken', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'root',
        name: 'Superuser',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('expected `username` to be unique');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode and message if username is invalid', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mo',
        name: 'Dr. Mo',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('shorter than the minimum allowed length (3)');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode and message if username is missing', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        name: 'Dr. Mo',
        password: 'salainen',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('`username` is required.');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode and message if password is invalid', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mom',
        name: 'Dr. Mom',
        password: 'sa',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('password must be at least 3 characters long');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });

    test('creation fails with proper statuscode and message if password is missing', async () => {
      const usersAtStart = await helper.usersInDb();

      const newUser = {
        username: 'mom',
        name: 'Dr. Mom',
      };

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/);

      expect(result.body.error).toContain('password must be at least 3 characters long');

      const usersAtEnd = await helper.usersInDb();
      expect(usersAtEnd).toHaveLength(usersAtStart.length);
    });
  });
});
