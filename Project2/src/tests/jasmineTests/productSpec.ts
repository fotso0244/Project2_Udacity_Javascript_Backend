import request from 'supertest';
import app from '../../server';
import dotenv from 'dotenv'
dotenv.config()

const { 
  token } = process.env

describe('Test endpoints of products', () => {
  const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
  beforeEach(function () {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
  });
  //create an object to send as POST data
var postData = {
  name_prod:'crayon',
  price: 100,
  catetgory: 'fourniture scolaire'
};
 
  it('should add product: crayon', function () {
    request(app)
    .post('/products')
    .send(postData)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res)=> {
      res.body.should.toEqual({
        id: 1,
        name_prod:'crayon',
        price: 100,
        category: 'fourniture scolaire'
      })
    })
    .end(function (err) {
      if (err) {
        throw err;
      }
      
    });
});
  it('gets products', () => {
    request(app)
      .get(
        '/products'
      )
      .expect(200)
      .expect((res)=>{
        res.body.should.be.instanceof(Array);
      })
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('gets product id 1 ', () => {
    request(app)
      .get(
        '/products/1'
      )
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('Should fail to get product id 2 ', () => {
    request(app)
      .get(
        '/products/2'
      )
      .expect(404)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('gets most-popular-products ', () => {
    request(app)
      .get(
        '/most-popular-products'
      )
      .expect(200)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('gets products of category: fourniture scolaire ', () => {
    request(app)
      .get(
        '/products-by-category/fourniture scolaire'
      )
      .expect(200)
      .end(function (err) {
        if (err) {
          throw err;
        }
      });
  });
  it('should fail to get products of category: machine ', () => {
    request(app)
      .get(
        '/products-by-category/machine'
      )
      .expect(404)
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
