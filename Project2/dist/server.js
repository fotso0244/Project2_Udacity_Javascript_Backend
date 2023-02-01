"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var orders_1 = __importDefault(require("./handlers/orders"));
var products_1 = __importDefault(require("./handlers/products"));
var users_1 = __importDefault(require("./handlers/users"));
var app = (0, express_1["default"])();
var address = "0.0.0.0:4000";
app.use(body_parser_1["default"].json());
app.get('/', function (req, res) {
    res.send('Welcome on storefront application!');
});
(0, orders_1["default"])(app);
(0, products_1["default"])(app);
(0, users_1["default"])(app);
app.listen(4000, function () {
    console.log("starting app on: ".concat(address));
});
exports["default"] = app;
