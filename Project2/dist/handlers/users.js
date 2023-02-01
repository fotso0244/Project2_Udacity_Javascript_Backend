"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var user_1 = require("../models/user");
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var jwt_decode_1 = __importDefault(require("jwt-decode"));
var cors_1 = __importDefault(require("cors"));
var store = new user_1.UserStore();
var user = {
    password_digest: "",
    firstname: "",
    lastname: ""
};
var index = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.index()];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); };
var show = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, store.show(_req.params.id)];
            case 1:
                user = _a.sent();
                if (user != null) {
                    res.json(user);
                    return [2 /*return*/];
                }
                else {
                    res.status(405);
                }
                return [2 /*return*/];
        }
    });
}); };
var create = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var newUser, token, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user = {
                    password_digest: _req.body.password_digest,
                    lastname: _req.body.lastname,
                    firstname: _req.body.firstname
                };
                return [4 /*yield*/, store.create(user)];
            case 1:
                newUser = _a.sent();
                token = jsonwebtoken_1["default"].sign({ user: newUser }, process.env.TOKEN_SECRET);
                res.json(token);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400);
                res.json(err_1 + user);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var update = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, password_digest, updateUser, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = '0';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                id = _req.params.id;
                password_digest = _req.body.password_digest;
                return [4 /*yield*/, store.update(+id, password_digest)];
            case 2:
                updateUser = _a.sent();
                res.json(updateUser);
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                res.status(400);
                res.json(err_2 + id);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var authenticate = function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var user_2, userCheck, token, err_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                user_2 = {
                    password_digest: _req.body.password_digest,
                    lastname: _req.body.lastname,
                    firstname: _req.body.firstname
                };
                return [4 /*yield*/, store.authenticate(user_2)];
            case 1:
                userCheck = _a.sent();
                if (userCheck != null) {
                    token = jsonwebtoken_1["default"].sign({ user: user_2 }, process.env.TOKEN_SECRET);
                    res.json(token);
                    //res.status(200).send('Authentification success')
                }
                res.status(403).send('Authentification failed');
                return [3 /*break*/, 3];
            case 2:
                err_3 = _a.sent();
                res.status(401);
                res.json({ err: err_3 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
var verifyAuthToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorizationHeader, token, decoded, decodedToken, retrLastname, retrFirstname, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                authorizationHeader = req.headers.authorization;
                token = authorizationHeader === null || authorizationHeader === void 0 ? void 0 : authorizationHeader.split(' ')[1];
                decoded = jsonwebtoken_1["default"].verify(token, process.env.TOKEN_SECRET);
                decodedToken = (0, jwt_decode_1["default"])(token);
                return [4 /*yield*/, store.getLastname(decodedToken.user.lastname)];
            case 1:
                retrLastname = _a.sent();
                return [4 /*yield*/, store.getFirstname(decodedToken.user.firstname)];
            case 2:
                retrFirstname = _a.sent();
                console.log(retrLastname);
                console.log(retrFirstname);
                if (!retrLastname || !retrFirstname) {
                    res.status(403).send('Authentification failed');
                    return [2 /*return*/];
                }
                res.locals.user = (0, jwt_decode_1["default"])(token);
                next();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                res.status(401);
                res.json({ error: error_1 });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var checkid = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, lastname, firstname, matchId, err_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = '0';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                id = req.params.id;
                lastname = res.locals.user.user.lastname;
                firstname = res.locals.user.user.firstname;
                return [4 /*yield*/, store.checkid(lastname, firstname)];
            case 2:
                matchId = _a.sent();
                if (+id == matchId) {
                    next();
                }
                else {
                    res.status(403).send("Id ".concat(id, " does not match your id, please use your Id - ").concat(matchId));
                }
                return [3 /*break*/, 4];
            case 3:
                err_4 = _a.sent();
                res.status(400);
                res.json(err_4 + id);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
    methods: "GET"
};
var userRoutes = function (app) {
    app.get('/users/list', (0, cors_1["default"])(corsOptions), index);
    app.get('/users', (0, cors_1["default"])(corsOptions), authenticate);
    app.post('/users', (0, cors_1["default"])({
        origin: '*',
        optionsSuccessStatus: 200,
        methods: "POST"
    }), create);
    app.put('/users/:id', (0, cors_1["default"])({
        origin: '*',
        optionsSuccessStatus: 200,
        methods: "PUT"
    }), verifyAuthToken, checkid, update);
    app.get('/users/:id', (0, cors_1["default"])(corsOptions), show);
};
exports["default"] = userRoutes;
