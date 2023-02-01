import request from 'supertest';
import app from '../../server';
import dotenv from 'dotenv'
dotenv.config()

const { 
  token } = process.env

describe('Test endpoints of users', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
   //create an object to send as POST data
var postData = {
  firstname:'aristide',
  lastname: 'fotso',
  password_digest: 'aris123'
};

  it('should create user: aristide', function () {
    request(app)
    .post('/users')
    .send(postData)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect((res)=> {
      res.body.firstname.should.toEqual('aristide')
      res.body.lastname.should.toEqual('fotso')
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err) {
      if (err) {
        throw err;
      }
      
    });
});
  it('gets users', () => {
    request(app)
      .get(
        '/users'
      )
      .expect(200)
      .expect((res)=> {
        res.body.should.be.instanceof(Array);
      })
      .end(function (err, res) {
        if (err) {
          throw err;
        }
        
      });
  });
  it('gets user id 1 ', () => {
    request(app)
      .get(
        '/users/1'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('Should fail to get user id 2 ', () => {
    request(app)
      .get(
        '/users/2'
      )
      .expect(405)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });

 
  afterEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });
});
