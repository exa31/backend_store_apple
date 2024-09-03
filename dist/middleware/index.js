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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIsUserData = exports.checkRole = exports.decodeToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const model_1 = __importDefault(require("./../app/users/model"));
const utils_1 = require("../utils");
const decodeToken = () => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const token = (0, utils_1.getToken)(req);
            if (!token) {
                return next();
            }
            if (token) {
                const user = yield model_1.default.findOne({ token: { $in: [token] } });
                if (!user) {
                    return next();
                }
                jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY, { algorithms: ['HS384'] }, (err, decoded) => {
                    if (err) {
                        return next();
                    }
                    req.user = decoded;
                    return next();
                });
            }
        }
        catch (error) {
            return next(error);
        }
    });
};
exports.decodeToken = decodeToken;
const checkRole = (role) => {
    return (req, res, next) => {
        if (req.user) {
            if (req.user.role === role) {
                return next();
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    };
};
exports.checkRole = checkRole;
const checkIsUserData = (_id) => {
    return (req, res, next) => {
        if (req.user) {
            if (req.user.id === _id) {
                return next();
            }
        }
        return res.status(403).json({ message: 'Forbidden' });
    };
};
exports.checkIsUserData = checkIsUserData;
