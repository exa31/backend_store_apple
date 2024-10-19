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
exports.getInvoice = void 0;
const model_1 = __importDefault(require("./model"));
const middleware_1 = require("../../middleware");
const getInvoice = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const invoices = yield model_1.default.findOne({ order: req.params.orderId }).populate({
            path: 'user',
            select: '-password -token -createdAt -updatedAt -role -cart -likes -_id -__v'
        }).populate('order');
        (0, middleware_1.checkIsUserData)(invoices.user._id.toString());
        res.status(200).json(invoices);
    }
    catch (error) {
        next(error);
    }
});
exports.getInvoice = getInvoice;
