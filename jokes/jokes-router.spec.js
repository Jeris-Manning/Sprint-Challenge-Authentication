const request = require('supertest');
const server = require('../api/server.js');

const db = require('../database/dbConfig.js');

let token;


beforeAll((done) => {
  db('users').truncate();
  request(server)
    .post('/api/auth/register')
    .send({ username: 'Jace', password: 'mindsculptor' })
    .end((err, response) => {
     token = response.body.token;
      done();
    });
});

describe('jokes-router tests', () => {
  describe('get the jokes', () => {
    it('should respond with 200 OK', () => {
      return request(server)
        .get('/api/jokes')
        .set('Authorization', `${token}`)
        .then((res) => {
          expect(res.status).toBe(200);
          expect(res.type).toBe('application/json');
        });
    });
  });
});
