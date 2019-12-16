const request = require('supertest');
const server = require('../api/server.js');
const db = require('../database/dbConfig.js');

describe('register', () => {
  it('should return 201 OK', () => {
    return db('users')
      .truncate()
      .then(() => {
        return request(server)
          .post('/api/auth/register')
          .send({ username: 'Bruce', password: 'Lee' });
      })
      .then((res) => {
        expect(res.status).toBe(201);
      });
  });
  it('should return a JSON object', () => {
    return db('users')
      .truncate()
      .then(() => {
        return request(server)
          .post('/api/auth/register')
          .send({ username: 'Peter', password: 'Parker' });
      })
      .then((res) => {
        expect(res.type).toBe('application/json');
      });
  });
});

describe('login', () => {
  it('should return 200 OK', () => {
    return db('users')
      .truncate()
      .then(() => {
        return request(server)
          .post('/api/auth/register')
          .send({ username: 'Bruce', password: 'Lee' });
      })
      .then(() => {
        return request(server)
          .post('/api/auth/login')
          .send({ username: 'Bruce', password: 'Lee' });
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });

  it('should return a JSON object', () => {
    return db('users')
      .truncate()
      .then(() => {
        return request(server)
          .post('/api/auth/register')
          .send({ username: 'Bruce', password: 'Lee' });
      })
      .then(() => {
        return request(server)
          .post('/api/auth/login')
          .send({ username: 'Bruce', password: 'Lee' });
      })
      .then((res) => {
        expect(res.type).toBe('application/json');
      });
  });
});
