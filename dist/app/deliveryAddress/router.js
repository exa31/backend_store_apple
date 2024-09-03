"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const router = express_1.default.Router();
router.get('/delivery-addresses', controller_1.getDeliveryAddresses);
router.get('/delivery-addresses/:id', controller_1.getDeliveryAddress);
router.post('/delivery-addresses', controller_1.createDeliveryAddress);
router.put('/delivery-addresses/:id', controller_1.updateDeliveryAddress);
router.delete('/delivery-addresses/:id', controller_1.deleteDeliveryAddress);
exports.default = router;
