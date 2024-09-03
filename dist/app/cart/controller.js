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
exports.removeProductFromCart = exports.reduceProductCart = exports.addProductToCart = exports.getCart = void 0;
const model_1 = __importDefault(require("./model"));
const getCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const cart = yield model_1.default.findOne({ user: req.user.id }).populate('products.product');
        if (cart) {
            return res.status(200).json(cart);
        }
        return res.status(404).json({ message: 'Cart not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getCart = getCart;
const addProductToCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId, quantity } = req.body;
        const cart = yield model_1.default.findOne({ user: req.user.id });
        if (cart) {
            const exisProduct = cart.products.find(product => product.product.toString() === productId);
            if (exisProduct) {
                exisProduct.quantity += quantity;
                yield cart.save();
                return res.status(200).json({ message: 'Product added to cart', cart });
            }
            else {
                cart.products.push({ product: productId, quantity });
                yield cart.save();
                return res.status(200).json({ message: 'Product added to cart', cart });
            }
        }
        return res.status(404).json({ message: 'Cart not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.addProductToCart = addProductToCart;
const reduceProductCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const cart = yield model_1.default.findOne({ user: req.user.id });
        if (cart) {
            const exisProduct = cart.products.find(product => product.product.toString() === productId);
            if (exisProduct) {
                if (exisProduct.quantity === 1) {
                    const cart = yield model_1.default.findOneAndUpdate({ user: req.user.id }, { $pull: { products: { product: productId } } }, { new: true });
                    return res.status(200).json({ message: 'Product removed from cart', cart });
                }
                else {
                    exisProduct.quantity -= 1;
                    yield cart.save();
                    return res.status(200).json({ message: 'Product reduced from cart', cart });
                }
            }
        }
        return res.status(404).json({ message: 'Cart not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.reduceProductCart = reduceProductCart;
const removeProductFromCart = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productId } = req.body;
        const cart = yield model_1.default.findOneAndUpdate({ user: req.user.id }, { $pull: { products: { product: productId } } }, { new: true });
        if (cart) {
            return res.status(200).json({ message: 'Product removed from cart', cart });
        }
        return res.status(404).json({ message: 'Cart not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.removeProductFromCart = removeProductFromCart;
