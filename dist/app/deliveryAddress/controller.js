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
exports.deleteDeliveryAddress = exports.updateDeliveryAddress = exports.createDeliveryAddress = exports.getDeliveryAddress = exports.getDeliveryAddresses = void 0;
const middleware_1 = require("../../middleware");
const model_1 = __importDefault(require("./model"));
const getDeliveryAddresses = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryAddresses = yield model_1.default.find({ user: req.user.id });
        if (deliveryAddresses.length > 0) {
            (0, middleware_1.checkIsUserData)(deliveryAddresses[0].user.toString());
            return res.status(200).json(deliveryAddresses);
        }
        return res.status(404).json({ message: 'Delivery Address not found', status: 404 });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getDeliveryAddresses = getDeliveryAddresses;
const getDeliveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryAddress = yield model_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            (0, middleware_1.checkIsUserData)(deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.user.toString());
            return res.status(200).json(deliveryAddress);
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.getDeliveryAddress = getDeliveryAddress;
const createDeliveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = Object.assign(Object.assign({}, req.body), { user: req.user.id });
        const deliveryAddress = yield model_1.default.create(payload);
        return res.status(201).json(deliveryAddress);
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.createDeliveryAddress = createDeliveryAddress;
const updateDeliveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryAddress = yield model_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            (0, middleware_1.checkIsUserData)(deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.user.toString());
            yield model_1.default.updateOne({ _id: req.params.id }, { $set: req.body });
            return res.status(200).json(deliveryAddress);
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.updateDeliveryAddress = updateDeliveryAddress;
const deleteDeliveryAddress = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const deliveryAddress = yield model_1.default.findOne({ _id: req.params.id, user: req.user.id });
        if (deliveryAddress) {
            (0, middleware_1.checkIsUserData)(deliveryAddress === null || deliveryAddress === void 0 ? void 0 : deliveryAddress.user.toString());
            yield model_1.default.deleteOne({ _id: req.params.id });
            return res.status(204).json();
        }
        return res.status(404).json({ message: 'Delivery Address not found' });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
});
exports.deleteDeliveryAddress = deleteDeliveryAddress;
