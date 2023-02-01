import request from 'supertest';
import app from '../../server';
import dotenv from 'dotenv'
dotenv.config()

const { 
  token } = process.env

describe('Test endpoints of orders', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  

  it('gets current order by user id 1', function () {
    request(app)
    .get('/current-order-by-user/1')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res)=> {
      res.body.should.toEqual({
        order_id: '1'
      })
    })
    .end(function (err) {
      if (err) {
        throw err;
      }
    });
});
it('gets completed orders by user id 1', function () {
  request(app)
  .get('/completed-orders-by-users/1')
  .set('Authorization', `Bearer ${token}`)
  .expect(200)
  .expect('Content-Type', /json/)
  .expect((res)=> {
    res.body.should.be.instanceof(Array);
  })
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
