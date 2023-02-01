"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../../server"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { token } = process.env;
describe('Test endpoints of products', () => {
    const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    //create an object to send as POST data
    var postData = {
        name_prod: 'crayon',
        price: 100,
        catetgory: 'fourniture scolaire'
    };
    it('should add product: crayon', function () {
        (0, supertest_1.default)(server_1.default)
            .post('/products')
            .send(postData)
            .set('Accept', 'application/json')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
            res.body.should.toEqual({
                id: 1,
                name_prod: 'crayon',
                price: 100,
                category: 'fourniture scolaire'
            });
        })
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('gets products', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/products')
            .expect(200)
            .expect((res) => {
            res.body.should.be.instanceof(Array);
        })
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('gets product id 1 ', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/products/1')
            .expect(200)
            .expect('Content-Type', /json/)
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('Should fail to get product id 2 ', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/products/2')
            .expect(404)
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('gets most-popular-products ', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/most-popular-products')
            .expect(200)
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('gets products of category: fourniture scolaire ', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/products-by-category/fourniture scolaire')
            .expect(200)
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('should fail to get products of category: machine ', () => {
        (0, supertest_1.default)(server_1.default)
            .get('/products-by-category/machine')
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
