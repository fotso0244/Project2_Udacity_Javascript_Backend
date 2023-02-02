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
  var postData = {
    order_id:'1',
    user_id: '1',
    status: 'active'
  };

  it('should create order id 1', function () {
    request(app)
    .post('/users/1/orders/1')
    .send(postData)
    .set('Accept', 'application/json')
    .set('Authorization', `Bearer ${token}`)
    .expect((res)=> {
      res.body.user_id.should.toEqual('1')
      res.body.order_id.should.toEqual('1')
      res.body.status.should.toEqual('active')
    })
    .expect('Content-Type', /json/)
    .expect(200)
    .end(function (err) {
      if (err) {
        throw err;
      }
      
    });
});
var postData1 = {
  order_id:'1',
  product_id: '1',
  quantity: 10
};

it('should add product id 1 to order id 1', function () {
  request(app)
  .post('/users/1/orders/1/products')
  .send(postData1)
  .set('Accept', 'application/json')
  .set('Authorization', `Bearer ${token}`)
  .expect((res)=> {
    res.body.product_id.should.toEqual('1')
    res.body.order_id.should.toEqual('1')
    res.body.quantity.should.toEqual(10)
  })
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function (err) {
    if (err) {
      throw err;
    }
    
  });
});
var postData3 = {
  status:'complete'
};

it('should update status of order id 1', function () {
  request(app)
  .put('/users/1/orders/1')
  .send(postData3)
  .set('Accept', 'application/json')
  .set('Authorization', `Bearer ${token}`)
  .expect((res)=> {
    res.body.user_id.should.toEqual('1')
    res.body.order_id.should.toEqual('1')
    res.body.status.should.toEqual('complete')
  })
  .expect('Content-Type', /json/)
  .expect(200)
  .end(function (err) {
    if (err) {
      throw err;
    }
    
  });
});

  it('gets orders', function () {
    request(app)
    .get('/orders')
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

  it('gets order id 1', function () {
    request(app)
    .get('/orders/1')
    .expect(200)
    .expect('Content-Type', /json/)
    .expect((res)=> {
      res.body.should.toEqual({
        order_id: '1',
        user_id: '1',
        status: 'active'
      })
      
      })
    .end(function (err) {
      if (err) {
        throw err;
      }
    });
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
