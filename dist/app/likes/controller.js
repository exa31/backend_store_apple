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
exports.Likes = exports.getLikes = void 0;
const model_1 = __importDefault(require("../users/model"));
const model_2 = __importDefault(require("../products/model"));
const getLikes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield model_1.default.findById(req.user.id).populate('likes');
        if (user) {
            return res.status(200).json(user.likes);
        }
        return res.status(404).json({ message: 'Wishlist not found' });
    }
    catch (error) {
        next(error);
    }
});
exports.getLikes = getLikes;
const Likes = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            console.log('unauthorized');
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const user = yield model_1.default.findById(req.user.id);
        if (user) {
            const product = yield model_2.default.findById(req.body.productId);
            const isLiked = user.likes.find(like => like.toString() === req.body.productId);
            if (isLiked) {
                user.likes = user.likes.filter(like => like.toString() !== req.body.productId);
                yield user.save();
                return res.status(200).json({ message: 'Product removed from wishlist' });
            }
            else if (!isLiked && product) {
                user.likes.push(product._id.toString());
                yield user.save();
                return res.status(201).json({ message: 'Product added to wishlist' });
            }
            return res.status(404).json({ message: 'Product not found' });
        }
        return res.status(404).json({ message: 'User not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.Likes = Likes;
