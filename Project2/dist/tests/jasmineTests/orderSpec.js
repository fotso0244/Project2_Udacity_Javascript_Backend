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
describe('Test endpoints of orders', () => {
    const originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });
    it('gets current order by user id 1', function () {
        (0, supertest_1.default)(server_1.default)
            .get('/current-order-by-user/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
            res.body.should.toEqual({
                order_id: '1'
            });
        })
            .end(function (err) {
            if (err) {
                throw err;
            }
        });
    });
    it('gets completed orders by user id 1', function () {
        (0, supertest_1.default)(server_1.default)
            .get('/completed-orders-by-users/1')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /json/)
            .expect((res) => {
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
