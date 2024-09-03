"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/carts', controller_1.getCart);
router.post('/carts', controller_1.addProductToCart);
router.post('/carts/reduce', controller_1.reduceProductCart);
router.post('/carts/remove', controller_1.removeProductFromCart);
exports.default = router;
