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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.me = exports.logout = exports.loginGoogle = exports.login = exports.createUser = exports.localStrategy = void 0;
const model_1 = __importDefault(require("./model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const utils_1 = require("../../utils");
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_2 = __importDefault(require("../cart/model"));
const localStrategy = (email, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    const inputPw = password;
    try {
        const user = yield model_1.default.findOne({ email: email }).select('-token -createdAt -updatedAt -address -phone_number -__v').select('+password +name');
        if (!user) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const isPasswordValid = yield bcrypt_1.default.compare(inputPw, user.password);
        if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid email or password' });
        }
        const _a = user.toJSON(), { password } = _a, userWhithOutPassword = __rest(_a, ["password"]);
        return done(null, userWhithOutPassword);
    }
    catch (error) {
        return done(error);
    }
});
exports.localStrategy = localStrategy;
const createUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.password = yield bcrypt_1.default.hash(req.body.password, 10);
        if (!(0, utils_1.isValidEmail)(req.body.email)) {
            throw new Error('Invalid email');
        }
        const { password, name, email } = req.body;
        const cart = new model_2.default();
        const user = new model_1.default({ password, name, email });
        user.cart = cart._id;
        cart.user = user._id;
        yield user.save();
        yield cart.save();
        res.status(201).json(user);
    }
    catch (error) {
        if (error.name === 'MongoServerError' && error.message.includes('duplicate key error')) {
            console.log(error.name);
            return res.status(400).json({ message: 'Email already exists' });
        }
        next(error);
    }
});
exports.createUser = createUser;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    passport_1.default.authenticate('local', (err, user) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return next(err);
        }
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }
        const token = jsonwebtoken_1.default.sign(user, process.env.SECRET_JWT_KEY, { expiresIn: '30d', algorithm: 'HS384' });
        try {
            yield model_1.default.findByIdAndUpdate({ _id: user._id }, { $push: { token: token } });
            res.status(200).json({ token, name: user.name });
        }
        catch (error) {
            console.log(error);
            next(error);
        }
    }))(req, res, next);
});
exports.login = login;
const loginGoogle = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield model_1.default.findOne({ email: email }).select('-token -createdAt -updatedAt -address -phone_number -__v -password -likes -cart');
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
        }
        else {
            const payload = { _id: user._id, email: user.email, name: user.name, role: user.role };
            const token = jsonwebtoken_1.default.sign(payload, process.env.SECRET_JWT_KEY, { expiresIn: '30d', algorithm: 'HS384' });
            yield model_1.default.findByIdAndUpdate({ _id: user._id }, { $push: { token: token } });
            res.status(200).json({ token, name: user.name });
        }
    }
    catch (error) {
        next(error);
    }
});
exports.loginGoogle = loginGoogle;
const logout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = (0, utils_1.getToken)(req);
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield model_1.default.findOneAndUpdate({ token: token }, { $pull: { token: token } });
        if (!user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        res.status(200).json({ message: 'Logout success' });
    }
    catch (error) {
        next(error);
    }
});
exports.logout = logout;
const me = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'token expired', status: 401 });
        }
        return res.status(200).json({ user: req.user, status: 200 });
    }
    catch (error) {
        return next(error);
    }
});
exports.me = me;
