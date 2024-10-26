"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/all-orders', controller_1.getAllOrders);
router.get('/orders', controller_1.getOrders);
router.get('/orders/:id', controller_1.getOrder);
router.post('/orders', controller_1.createOrder);
router.post('/orders/notification', controller_1.handleMidtransNotification);
router.put('/orders/:id', controller_1.updateOrder);
exports.default = router;
